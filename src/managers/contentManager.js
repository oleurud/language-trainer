'use strict'

const Promise = require('bluebird')
const Content = require('../appManager').models.Content
const { slugify } = require('../services/utils')
const exception = require('../services/customExceptions')

module.exports = {
    async getAll (pagination) {
        const contents = await Content.getAll(pagination)
        const contentsInfo = await Promise.all(
            Promise.map(contents, async function (content) {
                return content.getPublicInfo()
            })
        )

        return {
            contents: contentsInfo,
            pagination: {
                page: pagination.page,
                limit: pagination.limit
            }
        }
    },

    async create (name) {
        let content = new Content({
            name: name,
            slug: slugify(name)
        })

        try {
            content = await content.save()
        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                throw new exception.ValidationContentName()
            }
            throw new exception.SomethingWasWrong()
        }

        return content.getPublicInfo()
    },

    async getOne (content) {
        return content.getPublicInfo()
    },

    async remove (content) {
        content.removed = true
        content.save()

        return true
    }
}

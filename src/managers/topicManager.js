'use strict'

const Promise = require('bluebird')
const Topic = require('../appManager').models.Topic
const { slugify } = require('../services/utils')
const exception = require('../services/customExceptions')

module.exports = {
    async getAll (content, pagination) {
        const topics = await Topic.getAll(content, pagination)
        const topicsInfo = await Promise.all(
            Promise.map(topics, async function (topic) {
                return topic.getPublicInfo()
            })
        )

        return {
            topics: topicsInfo,
            pagination: {
                page: pagination.page,
                limit: pagination.limit
            }
        }
    },

    async create (content, name) {
        let topic = new Topic({
            name: name,
            slug: slugify(name),
            contentId: content.id
        })

        try {
            topic = await topic.save()
        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                throw new exception.ValidationTopicName()
            }
            throw new exception.SomethingWasWrong()
        }

        return topic.getPublicInfo()
    },

    async getOne (content, topicSlug) {
        const topic = await Topic.getOneBySlug(content, topicSlug)

        if (!topic) {
            throw new exception.TopicNotExists()
        }

        return topic.getPublicInfo()
    },

    async remove (content, contentSlug) {
        let topic = await Topic.getOneBySlug(content, contentSlug)

        if (!topic) {
            throw new exception.TopicNotExists()
        }

        topic.removed = true
        topic.save()

        return true
    }
}

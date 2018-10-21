'use strict'

const Promise = require('bluebird')
const Sentence = require('../appManager').models.Sentence
const { slugify } = require('../services/utils')
const exception = require('../services/customExceptions')

module.exports = {
    async byContent (content, pagination) {
        const sentences = await Sentence.getAllByContent(content, pagination)
        const sentencesInfo = await Promise.all(
            Promise.map(sentences, async function (sentence) {
                return sentence.getPublicInfo()
            })
        )

        return {
            sentences: sentencesInfo,
            pagination: {
                page: pagination.page,
                limit: pagination.limit
            }
        }
    },

    async byTopic (content, pagination) {
        const sentences = await Sentence.getAllByContent(content, pagination)
        const sentencesInfo = await Promise.all(
            Promise.map(sentences, async function (sentence) {
                return sentence.getPublicInfo()
            })
        )

        return {
            sentences: sentencesInfo,
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

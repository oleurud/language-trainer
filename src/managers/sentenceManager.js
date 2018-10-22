'use strict'

const Promise = require('bluebird')
const Sentence = require('../appManager').models.Sentence
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

    async byTopic (content, topic, pagination) {
        const sentences = await Sentence.getAllByContentAndTopic(content, topic, pagination)
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

    async create (content, topic, source, translation) {
        let sentence = new Sentence({
            source,
            translation,
            contentId: content.id,
            topicId: topic.id
        })

        try {
            sentence = await sentence.save()
        } catch (err) {
            throw new exception.SomethingWasWrong()
        }

        return sentence.getPublicInfo()
    },

    async remove (sentenceId) {
        let sentence = await Sentence.findOneById(sentenceId)

        if (!sentence) {
            throw new exception.SentenceNotExists()
        }

        sentence.removed = true
        sentence.save()

        return true
    }
}

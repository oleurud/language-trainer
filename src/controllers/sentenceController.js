'use strict'

const sentenceManager = require('../managers/sentenceManager')
const pagination = require('../services/pagination')

module.exports = {

    async byContent (req, res) {
        return sentenceManager.byContent(res.locals.content, pagination(req.query))
    },

    async byTopic (req, res) {
        return sentenceManager.byTopic(res.locals.content, res.locals.topic, pagination(req.query))
    },

    async create (req, res) {
        return contentManager.create(res.locals.content, res.locals.topic, req.body.source, req.body.translation)
    },

    async remove (req, res) {
        return contentManager.remove(req.params.sentenceId)
    }
}

'use strict'

const topicManager = require('../managers/topicManager')
const pagination = require('../services/pagination')

module.exports = {

    async getAll (req, res) {
        return topicManager.getAll(res.locals.content, pagination(req.query))
    },

    async create (req, res) {
        return topicManager.create(res.locals.content, req.body.name)
    },

    async getOne (req, res) {
        return topicManager.getOne(res.locals.content, req.params.topicSlug)
    },

    async remove (req, res) {
        return topicManager.remove(res.locals.content, req.params.topicSlug)
    }
}

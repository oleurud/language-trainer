'use strict'

const contentManager = require('../managers/contentManager')
const pagination = require('../services/pagination')

module.exports = {

    async getAll (req, res) {
        return contentManager.getAll(pagination(req.query))
    },

    async create (req, res) {
        return contentManager.create(req.body.name)
    },

    async getOne (req, res) {
        return contentManager.getOne(res.locals.content)
    },

    async remove (req, res) {
        return contentManager.remove(res.locals.content)
    }
}

'use strict'

const Content = require('../appManager').models.Content
const exception = require('../services/customExceptions')

module.exports = function getContent() {
    return async function (req, res, next) {
        const content = await Content.getOneBySlug(req.params.contentSlug)

        if (!content) {
            throw new exception.ContentNotExists()
        }

        res.locals.content = content
        next()
    }
}

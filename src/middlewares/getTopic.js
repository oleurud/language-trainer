'use strict'

const Topic = require('../appManager').models.Topic
const exception = require('../services/customExceptions')

module.exports = function getTopic () {
    return async function (req, res, next) {
        const topic = await Topic.getOneBySlug(req.params.topicSlug)

        if (!topic) {
            throw new exception.ContentNotExists()
        }

        res.locals.topic = topic
        next()
    }
}

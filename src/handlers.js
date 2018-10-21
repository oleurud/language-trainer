'use strict'

const expressDeliver = require('express-deliver')

module.exports = function (app) {
    // 404 and 500
    expressDeliver.errorHandler(app)
}

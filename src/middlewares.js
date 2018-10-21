'use strict'

const morgan = require('morgan')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const cors = require('cors')
const expressDeliver = require('express-deliver')
const customExceptions = requireRoot('services/customExceptions')
const appManager = require('./appManager')
const parameters = requireRoot('../config/parameters')

module.exports = function (app) {
    expressDeliver(app, {
        exceptionPool: customExceptions,
        printErrorStack: process.env.TEST_MODE ? false : parameters.expressDeliver.printErrorStack,
        printInternalErrorData: process.env.TEST_MODE ? false : parameters.expressDeliver.printInternalErrorData
    })

    // Disable express header
    app.set('x-powered-by', false)
    app.set('etag', false)

    // cors
    app.use(cors())

    // Helmet security enabled
    app.use(helmet())

    // Simple request logger
    if (!process.env.TEST_MODE) {
        app.use(morgan('dev'))
    }

    // Throw error if no db connection
    app.use(function (req, res, next) {
        if (!appManager.running) {
            throw new customExceptions.DatabaseError()
        }
        next()
    })

    // Parses http body
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())

    // Check device
    app.use(function (req, res, next) {
        let device = req.get('X-device')

        if (!device) { throw new customExceptions.ValidationDeviceFailed() }

        req.device = device
        next()
    })
}

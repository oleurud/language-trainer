'use strict'

const path = require('path')

//Globals definition
global.requireRoot = function (name) {
    return require(path.resolve(__dirname, 'src/', name))
}

// Basic includes
const debug = require('debug')('app:root')
debug('init')

// bootstrap express
const parameters = require('./config/parameters')
const express = require('express')
const app = express()

// AppManager
const appManager = require('./src/appManager')

// init dbs
appManager.initDBs()
appManager.once('appManager:db:ready', () => {
    require('./src/middlewares')(app)
    require('./src/routes')(app)
    require('./src/handlers')(app)

    var port = process.env.TEST_MODE ?
        parameters.test.listenPort :
        parameters.listenPort

    // If run in mocha disabled the listen
    if (!process.env.TEST_MODE) {
        app.listen(port, function () {
            debug('App listening ', port)
            appManager.emit('appManager:app:ready', app)
        })
    } else {
        appManager.emit('appManager:app:ready', app)
    }
})

//Simple process log
process.on('exit', function () {
    debug('exit')
})
process.on('SIGINT', function () {
    debug('sigint')
    process.exit(1)
})
process.on('uncaughtException', function (err) {
    if (!process.env.TEST_MODE) {
        debug('uncaughtException', err)
    }
})

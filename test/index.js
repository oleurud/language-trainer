'use strict'

const path = require('path')
const Mocha = require('mocha')
const mocha = new Mocha({})
const debug = require('debug')('app:test')

//Globals definition
global.requireRoot = function (name) {
    return require(path.resolve('src/', name))
}

const helper = require('./helper')

// start app
const appTest = require('../index')
const appManager = require('../src/appManager')
appManager.on('appManager:app:ready', (app) => {
    global.testApp = app

    // Test suites
    mocha.addFile(__dirname + '/functional/index.js')
    mocha.addFile(__dirname + '/functional/auth.js')
    mocha.addFile(__dirname + '/functional/user.js')
    mocha.addFile(__dirname + '/functional/content.js')

    // run tests
    mocha.run()
        .on('test', function (test) {
        })
        .on('test end', function (test) {
        })
        .on('pass', function (test) {
        })
        .on('fail', function (test, err) {
            if (process.env.NOTIFY == 1) {
                debug({
                    'title': test.title,
                    'message': test.file
                })
            }
        })
        .on('end', async function () {
            // Clean db
            debug('Clean dbs')
            await helper.cleanDb()

            process.exit()
        })

})

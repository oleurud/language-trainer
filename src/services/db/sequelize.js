const path = require('path')
const fs = require('fs')
const Sequelize = require('sequelize')
const debug = require('debug')('app:sequelize')
const parameters = requireRoot('../config/parameters')

function initConnection () {
    if (process.env.TEST_MODE) {
        parameters.postgres = parameters.test.postgres
    }

    return new Sequelize(parameters.postgres.database, parameters.postgres.username, parameters.postgres.password, {
        host: parameters.postgres.host,
        port: parameters.postgres.port,
        dialect: 'postgres',
        logging: false,

        pool: {
            max: 16,
            min: 0,
            idle: 10000
        }
    })
}

function initModels (sequelize) {
    const MODELS_PATH = path.resolve('src/models')

    const modelNames = fs.readdirSync(MODELS_PATH)
        .map(file => {
            if (file[0] !== '_') {
                return file.substring(0, file.lastIndexOf('.'))
            }
        })
        .filter(file => file)

    const models = {}
    modelNames.forEach(function (modelName) {
        const model = sequelize.import(path.resolve(MODELS_PATH, modelName))
        models[modelName] = model
    })

    for (let modelName in models) {
        const model = models[modelName]
        if ('associate' in model) { model.associate(models) }
    }

    return models
}

function isConnected (sequelize) {
    return sequelize.authenticate()
        .then(() => true)
        .catch(err => {
            debug('Connection error')
            throw err
        })
}

async function startClient () {
    const sequelize = initConnection()
    const models = await initModels(sequelize)

    return isConnected(sequelize)
        .then(status => {
            debug('connected')

            return sequelize.sync()
                .then(data => {
                    debug('sync')
                    return models
                })
                .catch(err => {
                    debug('sync error', err)
                })
        })
        .catch(err => {
            debug('error', err)
        })
}

module.exports = {
    startClient
}

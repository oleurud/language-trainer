const EventEmitter = require('events')
const debug = require('debug')('app:appManager')

class AppManager extends EventEmitter {
    constructor () {
        super()
        this.running = false
        this.redisReady = false
        this.postgresReady = false
        this.models = null
    }

    initDBs () {
        this.initRedis()
        this.initSequelize()
    }

    handleConnections () {
        if (this.redisReady && this.postgresReady) {
            this.running = true
            debug('appManager:db:ready')
            this.emit('appManager:db:ready')
        } else if (this.running) {
            this.running = false
            debug('appManager:db:error')
            this.emit('appManager:db:error')
        }
    }

    initRedis () {
        const redisClient = require('./services/db/redis').startClient()

        // Client event listening for changes in connection
        redisClient.on('ready', () => {
            debug('Redis Connected')
            this.redisReady = true
            this.handleConnections()
        })

        redisClient.on('end', () => {
            debug('Redis Disconnected')
            this.redisReady = false
            this.handleConnections()
        })

        redisClient.on('error', () => {
            debug('Redis Error connecting')
            this.redisReady = false
            this.handleConnections()
        })
    }

    initSequelize () {
        const sequelize = require('./services/db/sequelize')
        sequelize.startClient()
            .then(models => {
                this.models = models
                this.postgresReady = true
                debug('Sequelize Ready')
                this.handleConnections()
            })
            .catch(err => {
                this.postgresReady = false
                debug('Sequelize Error connecting', err)
                this.handleConnections()
            })
    }
}

module.exports = new AppManager()

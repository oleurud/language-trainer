'use strict'

const redis = require('redis')
const parameters = requireRoot('../config/parameters')
const debug = require('debug')('app:redis')
const Promise = require('bluebird')

// Promisify redis
Promise.promisifyAll(redis.RedisClient.prototype)
Promise.promisifyAll(redis.Multi.prototype)

let client

/**
 * Get redis client
 * @return {RedisClient}
 */
exports.getClient = function () {
    return client
}

/**
 * Starts the connection with Redis
 */
exports.startClient = function () {
    const eventNames = ['ready', 'connect', 'reconnecting', 'error', 'end', 'warning']

    // Connection uri
    const redisUrl = process.env.TEST_MODE ? parameters.test.redisConnectionUri : parameters.redisConnectionUri

    // Client initialization
    client = redis.createClient({
        url: redisUrl,
        retry_strategy: function (options) {
            debug('Redis Reconnecting attempt ' + options.attempt)
            return Math.min(options.attempt * 50, 5000)
        }
    })

    // Clients event debug
    if (debug.enabled) {
        eventNames.forEach(function (eventName) {
            client.on(eventName, function (e) {
                if (e) { debug(eventName, e) } else { debug(eventName) }
            })
        })
    }

    return client
}

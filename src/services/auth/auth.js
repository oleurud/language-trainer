'use strict'

const jwt = require('./jwt')
const redis = require('../db/redis')
const redisClient = redis.getClient()
const exception = require('../customExceptions')
const User = requireRoot('appManager').models.User

module.exports = {

    async validate (req, res, next) {
        const token = req.get('Authorization')

        // verify token
        const tokenDecoded = await jwt.verify(token, req.device)
        if (!tokenDecoded ||
            !tokenDecoded.id ||
            !tokenDecoded.username ||
            !tokenDecoded.role ||
            !tokenDecoded.device ||
            tokenDecoded.device !== req.device
        ) {
            throw new exception.ValidationPublicKeyFailed()
        }

        // verify in redis
        const userFromRedis = await verifyInRedis(token, tokenDecoded.id, tokenDecoded.device)
        if (!userFromRedis) {
            throw new exception.ValidationPublicKeyFailed()
        }

        // get user from db
        const user = await User.findOne({
            where: {
                id: tokenDecoded.id,
                username: tokenDecoded.username,
                role: tokenDecoded.role
            }
        })

        if (!user) {
            throw new exception.ValidationPublicKeyFailed()
        }

        req.user = user

        next()
    }
}

function verifyInRedis (tokenReceived, userId, device) {
    const redisKey = userId + ':tokens'

    return redisClient.getAsync(redisKey).then(tokensString => {
        const tokens = JSON.parse(tokensString)

        if (!tokens || !tokens.length) {
            return false
        } else {
            let existingToken = false

            for (const token of tokens) {
                if (token.token === tokenReceived && token.device === device) {
                    existingToken = true
                    break
                }
            }

            return existingToken
        }
    })
}

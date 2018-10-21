'use strict'

const bcrypt = require('bcrypt')
const redis = requireRoot('services/db/redis')
const base = require('./_Base')
const schemaValidator = require('../services/db/schemaValidator')

function processPassword (user) {
    const SALT_FACTOR = 5

    return new Promise((resolve, reject) => {
        bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
            if (err) reject(err)

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) reject(err)
                user.password = hash
                resolve()
            })
        })
    })
}

module.exports = (sequelize, DataTypes) => {
    let User = sequelize.define('user', Object.assign({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM,
            values: ['Client', 'SuperAdmin'],
            defaultValue: 'Client',
            allowNull: false
        },
        profile: {
            type: DataTypes.JSON,
            validate: {
                schema: schemaValidator({
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        lastname: { type: 'string' },
                        image: { type: 'string' }
                    }
                })
            }
        },
        payments: {
            type: DataTypes.JSON,
            validate: {
                schema: schemaValidator({
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            type: {
                                type: 'string',
                                required: true,
                                enum: [
                                    'Paypal'
                                ]
                            },
                            active: {
                                type: 'boolean',
                                required: true,
                                default: true
                            },
                            credentials: {
                                type: 'object',
                                required: true
                            }
                        }
                    }
                })
            }
        }

    }, base), {
        timestamps: true,
        defaultScope: {
            where: {
                removed: false,
                actived: true
            }
        },
        hooks: {
            beforeCreate (user, options) {
                return processPassword(user)
            },

            beforeUpdate (user, options) {
                if (user.changed('password')) {
                    return processPassword(user)
                }
            }
        }
    })

    // Associate example
    // Country.associate = function (models) {
    //     Country.belongsTo(models.Project)
    //     Country.belongsTo(models.Cid)
    // }

    /*
     * INSTANCE METHODS
     */
    Object.assign(User.prototype, {

        comparePassword (candidatePassword) {
            return new Promise((resolve, reject) => {
                bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
                    if (err || !isMatch) {
                        resolve(false)
                    }

                    resolve(true)
                })
            })
        },

        setPassword (password) {
            this.password = password
        },

        getPublicInfo () {
            let publicInfo = {
                email: this.email,
                username: this.username,
                role: this.role
            }

            if (this.profile) { publicInfo.profile = this.profile }

            return publicInfo
        },

        getTokenByDevice (device) {
            const redisKey = this.id + ':tokens'
            const redisClient = redis.getClient()
            return redisClient.getAsync(redisKey).then(tokensString => {
                const tokens = JSON.parse(tokensString)
                for (const token of tokens) {
                    if (token.device === device) {
                        return token
                    }
                }

                return false
            })
        },

        addToken (newToken, device) {
            const redisKey = this.id + ':tokens'
            const redisClient = redis.getClient()
            return redisClient.getAsync(redisKey)
                .then(tokensString => {
                    let tokens = JSON.parse(tokensString)

                    // add token
                    let existingToken = false

                    if (!tokens || !tokens.length) {
                        tokens = []
                    } else {
                        for (const token of tokens) {
                            if (token.device === device) {
                                token.token = newToken
                                existingToken = true
                                break
                            }
                        }
                    }

                    if (!existingToken) {
                        tokens.push({
                            token: newToken,
                            device: device
                        })
                    }

                    return tokens
                })
                .then(tokens => {
                    // save tokens
                    redisClient.set(redisKey, JSON.stringify(tokens))
                })
        },

        removeAllTokens () {
            const redisKey = this.id + ':tokens'
            const redisClient = redis.getClient()
            redisClient.del(redisKey)
        },

        getPaymentsInfo () {
            let paymentsInfo = []
            if (this.payments) {
                paymentsInfo = this.payments.map((payment) => {
                    return {
                        id: payment._id,
                        type: payment.type,
                        active: payment.active
                    }
                })
            }

            return paymentsInfo
        }
    })

    return User
}

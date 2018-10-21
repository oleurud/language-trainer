'use strict'

const Sequelize = require('sequelize')

module.exports = {
    actived: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    },
    removed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
}

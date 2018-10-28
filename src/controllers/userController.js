'use strict'

const userManager = require('../managers/userManager')

module.exports = {

    async getProfile (req, res) {
        return userManager.getProfile(res.locals.user)
    },

    async setProfile (req, res) {
        return userManager.setProfile(res.locals.user, req.body)
    }

}

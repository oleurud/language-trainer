'use strict'

const userManager = require('../managers/userManager')

module.exports = {

    async getProfile (req, res) {
        return userManager.getProfile(req.user)
    },

    async setProfile (req, res) {
        return userManager.setProfile(req.user, req.body)
    }

}

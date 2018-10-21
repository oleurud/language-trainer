'use strict'

const authManager = require('../managers/authManager')

module.exports = {

    async login (req, res) {
        const email = req.body.email
        const password = req.body.password
        const username = req.body.username
        const device = req.device

        return authManager.login(email, username, password, device)
    },

    async register (req, res) {
        const email = req.body.email
        const password = req.body.password
        const username = req.body.username
        const device = req.device

        return authManager.register(email, password, username, device)
    },

    async changePassword (req, res) {
        const email = req.body.email
        const password = req.body.password
        const newPassword = req.body.newPassword
        const device = req.device

        return authManager.changePassword(email, password, newPassword, device)
    }

}

'use strict'

const jwt = require('../services/auth/jwt')
const User = require('../appManager').models.User
const exception = require('../services/customExceptions')

module.exports = {

    async login (email, username, password, device) {
        validateLogin(email, username, password)

        let query
        if (email) { query = { where: { email } } } else if (username) { query = { where: { username } } }

        let user = await User.findOne(query)
        if (!user || !await user.comparePassword(password)) {
            throw new exception.ValidationLogin({
                error: 'Your login details could not be verified. Please try again.'
            })
        }

        // generate Token
        const token = jwt.generateAccessToken(user, device)
        user.addToken(token, device)

        return {
            token: token,
            user: user.getPublicInfo()
        }
    },

    async register (email, password, username, device) {
        validateRegistration(email, password, username)

        // check if email exists
        let existingUser = await User.findOne({
            where: { email }
        })

        if (existingUser) {
            throw new exception.ValidationRegistration({
                error: 'That email address is already in use.'
            })
        }

        // check if username exists
        existingUser = await User.findOne({
            where: { username }
        })

        if (existingUser) {
            throw new exception.ValidationRegistration({
                error: 'That username is already in use.'
            })
        }

        // valid user
        let user = new User({
            email,
            password,
            username
        })
        user = await user.save()

        const token = jwt.generateAccessToken(user, device)
        user.addToken(token, device)

        return {
            token: token,
            user: user.getPublicInfo()
        }
    },

    async changePassword (email, password, newPassword, device) {
        validateChangePassword(email, password, newPassword)

        let user = await User.findOne({
            where: { email }
        })
        if (!user || !await user.comparePassword(password)) {
            throw new exception.ValidationChangePassword({
                error: 'Your login details could not be verified. Please try again.'
            })
        }

        // set new password
        user.setPassword(newPassword)
        await user.save()

        // remove all user tokens
        user.removeAllTokens()

        // generate a new token
        let token = jwt.generateAccessToken(user, device)
        user.addToken(token, device)

        return {
            token: token,
            user: user.getPublicInfo()
        }
    }
}

function validateRegistration (email, password, username) {
    if (!email || !password || !username) {
        throw new exception.ValidationRegistration({
            error: 'You must set email, password and username.'
        })
    }

    validateEmail(email)
    validateUsername(username)
    validatePassword(password)
}

function validateLogin (email, username, password) {
    if ((!email && !username) || !password) {
        throw new exception.ValidationLogin({
            error: 'Your login details could not be verified. Please try again.'
        })
    }

    if (email) { validateEmail(email) } else if (username) { validateUsername(username) }

    validatePassword(password)
}

function validateChangePassword (email, password, newPassword) {
    if (!email || !password || !newPassword) {
        throw new exception.ValidationChangePassword({
            error: 'Your login details could not be verified. Please try again.'
        })
    }

    validateEmail(email)
    validatePassword(password)
    validatePassword(newPassword)
}

function validateEmail (email) {
    if (!(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email))) { throw new exception.ValidationEmail() }
}

function validateUsername (username) {
    if (username.length < 4) {
        throw new exception.ValidationUsername({
            error: 'You must set 3 or more characters for username.'
        })
    }

    if (!(/^([a-zA-Z0-9_.-]+)$/.test(username))) {
        throw new exception.ValidationUsername({
            error: "The username must have numbers, letters, '-', '.' and '_'"
        })
    }
}

function validatePassword (password) {
    if (password.length < 8) {
        throw new exception.ValidationPassword({
            error: 'You must set 8 or more characters for password.'
        })
    }
}

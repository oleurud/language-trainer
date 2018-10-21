'use strict'

const express = require('express')
const expressDeliver = require('express-deliver')
const auth = require('./services/auth/auth')

const mainController = require('./controllers/mainController')
const authController = require('./controllers/authController')
const userController = require('./controllers/userController')

module.exports = function (app) {
    // Test routes
    app.get('/', mainController.index)
    app.get('/logged', auth.validate, mainController.logged)

    // Auth routes
    let authRouter = express.Router({ mergeParams: true })
    expressDeliver(authRouter)
    app.use('/auth', authRouter)

    authRouter.post('/register', authController.register)
    authRouter.post('/login', authController.login)
    authRouter.post('/change-password', auth.validate, authController.changePassword)

    // User routes
    let userRouter = express.Router({ mergeParams: true })
    expressDeliver(userRouter)
    app.use('/user', userRouter)

    userRouter.get('/', auth.validate, userController.getProfile)
    userRouter.put('/', auth.validate, userController.setProfile)
}

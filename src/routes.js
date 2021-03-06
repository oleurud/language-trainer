'use strict'

const express = require('express')
const expressDeliver = require('express-deliver')
const auth = require('./services/auth/auth')
const getContentMiddleware = require('./middlewares/getContent')
const getTopicMiddleware = require('./middlewares/getTopic')

const mainController = require('./controllers/mainController')
const authController = require('./controllers/authController')
const userController = require('./controllers/userController')
const contentController = require('./controllers/contentController')
const topicController = require('./controllers/topicController')
const sentenceController = require('./controllers/sentenceController')

module.exports = function (app) {
    // Test routes
    app.get('/', mainController.index)
    app.get('/logged', auth.validate, mainController.logged)

    // Auth routes
    let authRouter = express.Router({ mergeParams: true })
    expressDeliver(authRouter)
    app.use('/auth', authRouter)

    authRouter.post('/register', auth.validate, auth.superadmin, authController.register)
    authRouter.post('/login', authController.login)
    authRouter.post('/change-password', auth.validate, authController.changePassword)

    // User routes
    let userRouter = express.Router({ mergeParams: true })
    expressDeliver(userRouter)
    app.use('/user', userRouter)

    userRouter.get('/', auth.validate, userController.getProfile)
    userRouter.put('/', auth.validate, userController.setProfile)

    // Content routes
    let contentRouter = express.Router({ mergeParams: true })
    expressDeliver(contentRouter)
    contentRouter.use(auth.validate)
    app.use('/content', contentRouter)

    contentRouter.get('/', contentController.getAll)
    contentRouter.post('/', auth.superadmin, contentController.create)
    contentRouter.get('/:contentSlug', auth.superadmin, getContentMiddleware(), contentController.getOne)
    contentRouter.delete('/:contentSlug', auth.superadmin, getContentMiddleware(), contentController.remove)

    // Topic routes
    let topicRouter = express.Router({ mergeParams: true })
    expressDeliver(topicRouter)
    topicRouter.use(auth.validate)
    topicRouter.use(getContentMiddleware())
    contentRouter.use('/:contentSlug/topic', topicRouter)

    topicRouter.get('/', topicController.getAll)
    topicRouter.post('/', auth.superadmin, topicController.create)
    topicRouter.get('/:topicSlug', auth.superadmin, getTopicMiddleware(), topicController.getOne)
    topicRouter.delete('/:topicSlug', auth.superadmin, getTopicMiddleware(), topicController.remove)

    // Sentence routes
    let sentenceRouter = express.Router({ mergeParams: true })
    expressDeliver(sentenceRouter)
    sentenceRouter.use(auth.validate)
    app.use('/sentence', sentenceRouter)

    sentenceRouter.get('/content/:contentSlug', getContentMiddleware(), sentenceController.byContent)
    sentenceRouter.get('/content/:contentSlug/topic/:topicSlug', getContentMiddleware(), getTopicMiddleware(), sentenceController.byTopic)
    sentenceRouter.post('/content/:contentSlug/topic/:topicSlug', auth.superadmin, getContentMiddleware(), getTopicMiddleware(), sentenceController.create)
    sentenceRouter.delete('/:sentenceId', auth.superadmin, sentenceController.remove)
}

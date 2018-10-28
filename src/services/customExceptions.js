'use strict'

const ExceptionPool = require('express-deliver').ExceptionPool

const exceptionPool = new ExceptionPool({
    SomethingWasWrong: {
        code: 666,
        message: 'Something was wrong',
        statusCode: 500
    },
    ValidationFailed: {
        code: 10001,
        message: 'Authentication failed',
        statusCode: 401
    },
    ValidationPublicKeyFailed: {
        code: 10002,
        message: 'Authentication failed',
        statusCode: 401
    },
    ValidationDeviceFailed: {
        code: 10003,
        message: 'You must set a device',
        statusCode: 401
    },
    ValidationTokenExpired: {
        code: 10004,
        message: 'Token expired',
        statusCode: 401
    },
    ValidationEmail: {
        code: 10005,
        message: 'Invalid email',
        statusCode: 401
    },
    ValidationUsername: {
        code: 10006,
        message: 'Invalid username',
        statusCode: 401
    },
    ValidationPassword: {
        code: 10007,
        message: 'Invalid password',
        statusCode: 403
    },
    ValidationSuperadmin: {
        code: 10008,
        message: 'You do not have enough permissions',
        statusCode: 403
    },
    ValidationRegistration: {
        code: 10100,
        message: 'Invalid registration',
        statusCode: 401
    },
    ValidationLogin: {
        code: 10101,
        message: 'Invalid login',
        statusCode: 403
    },
    ValidationChangePassword: {
        code: 10102,
        message: 'Invalid change password',
        statusCode: 401
    },
    ValidationContentName: {
        code: 10300,
        message: 'This content name already exists',
        statusCode: 405
    },
    ValidationTopicName: {
        code: 10400,
        message: 'This topic name already exists',
        statusCode: 405
    },
    DatabaseError: {
        code: 20001,
        message: 'Database error',
        statusCode: 500
    },
    ContentNotExists: {
        code: 50001,
        message: 'Content not exists',
        statusCode: 404
    },
    TopicNotExists: {
        code: 50002,
        message: 'Content not exists',
        statusCode: 404
    },
    SentenceNotExists: {
        code: 50003,
        message: 'Sentence not exists',
        statusCode: 404
    }
})

module.exports = exceptionPool

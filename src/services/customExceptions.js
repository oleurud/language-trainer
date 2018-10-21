'use strict'

const ExceptionPool = require('express-deliver').ExceptionPool

const exceptionPool = new ExceptionPool({
    SomethingWasWrong: {
        code: 666,
        message: 'Something was wrong',
        statusCode: 405
    },
    ValidationFailed: {
        code: 10001,
        message: 'Authentication failed',
        statusCode: 403
    },
    ValidationPublicKeyFailed: {
        code: 10002,
        message: 'Authentication failed',
        statusCode: 403
    },
    ValidationDeviceFailed: {
        code: 10003,
        message: 'You must set a device',
        statusCode: 403
    },
    ValidationTokenExpired: {
        code: 10004,
        message: 'Token expired',
        statusCode: 403
    },
    ValidationEmail: {
        code: 10005,
        message: 'Invalid email',
        statusCode: 403
    },
    ValidationUsername: {
        code: 10006,
        message: 'Invalid username',
        statusCode: 403
    },
    ValidationPassword: {
        code: 10007,
        message: 'Invalid password',
        statusCode: 403
    },
    ValidationRegistration: {
        code: 10100,
        message: 'Invalid registration',
        statusCode: 403
    },
    ValidationLogin: {
        code: 10101,
        message: 'Invalid login',
        statusCode: 403
    },
    ValidationChangePassword: {
        code: 10102,
        message: 'Invalid change password',
        statusCode: 403
    },
    ValidationContentName: {
        code: 10300,
        message: 'This content name already exists',
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
    }
})

module.exports = exceptionPool

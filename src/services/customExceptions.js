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
    ValidationNotImagesUploaded: {
        code: 10200,
        message: 'Not images uploaded',
        statusCode: 405
    },
    ValidationImagesInvalidFormat: {
        code: 10201,
        message: 'Invalid image format (only jpg and png allowed)',
        statusCode: 405
    },
    ValidationCollectionName: {
        code: 10300,
        message: 'This collection name already exists',
        statusCode: 405
    },
    DatabaseError: {
        code: 20001,
        message: 'Database error',
        statusCode: 500
    },
    NoPaymentsAddedValidation: {
        code: 40000,
        message: 'No payments methods added',
        statusCode: 402
    },
    NoPaymentsActiveValidation: {
        code: 40001,
        message: 'No payments methods active',
        statusCode: 402
    },
    PaymentsValidation: {
        code: 40100,
        message: 'Bad parameters adding payment method',
        statusCode: 405
    },
    CollectionNotExists: {
        code: 50001,
        message: 'Collection not exists',
        statusCode: 404
    },
    CollectionUploadImagesError: {
        code: 50002,
        message: 'Error uploading images',
        statusCode: 405
    },
    ImageNotExists: {
        code: 50101,
        message: 'Image not exists',
        statusCode: 404
    },
    AnalysisAlreadyDone: {
        code: 60001,
        message: 'Analysis already done',
        statusCode: 405
    },
    AnalysisNotExists: {
        code: 60002,
        message: 'The analysis does not exist',
        statusCode: 404
    }
})

module.exports = exceptionPool

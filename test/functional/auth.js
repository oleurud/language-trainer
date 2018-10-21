'use strict';

const expect = require('chai').expect
const request = require('supertest').agent(testApp)
const faker = require('faker')
const exception = requireRoot('services/customExceptions')
const debug = require('debug')('app:test:functional:auth')


let validToken, newValidToken
let validUser = {
    "email": faker.internet.email().toLowerCase(),
    "password": faker.internet.password() + faker.internet.password(),
    "username": faker.internet.userName().toLowerCase()
}
let newPassword = faker.internet.password() + faker.internet.password()


describe('FUNCTIONAL API - AUTH', function(){

    it('should response ko (register invalid email)',function(done){
        let error = new exception.ValidationEmail()
        let data = {
            "email": faker.internet.userName().toLowerCase(),
            "password": validUser.password,
            "username": validUser.username
        }

        request
            .post('/auth/register')
            .set('X-device', 'aaa')
            .send(data)
            .expect(error.statusCode)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.body).to.deep.equal({
                    "status": false,
                    "error": {
                        "code": error.code,
                        "message": error.message
                    }
                })
                done()
            })
    })

    it('should response ko (register invalid password length)',function(done){
        let error = new exception.ValidationPassword()
        let data = {
            "email": validUser.email,
            "password": 'aaa',
            "username": validUser.username
        }

        request
            .post('/auth/register')
            .set('X-device', 'aaa')
            .send(data)
            .expect(error.statusCode)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.body).to.deep.equal({
                    "status": false,
                    "error": {
                        "code": error.code,
                        "message": error.message,
                        "data": {
                            "error": "You must set 8 or more characters for password."
                        }
                    }
                })
                done()
            })
    })

    it('should response ko (register invalid username length)',function(done){
        let error = new exception.ValidationUsername()
        let data = {
            "email": validUser.email,
            "password": validUser.password,
            "username": 'a'
        }

        request
            .post('/auth/register')
            .set('X-device', 'aaa')
            .send(data)
            .expect(error.statusCode)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.body).to.deep.equal({
                    "status": false,
                    "error": {
                        "code": error.code,
                        "message": error.message,
                        "data": {
                            "error": "You must set 3 or more characters for username."
                        }
                    }
                })
                done()
            })
    })

    it('should response ko (register invalid char % in username)',function(done){
        let error = new exception.ValidationUsername()
        let data = {
            "email": validUser.email,
            "password": validUser.password,
            "username": '12345678%'
        }

        request
            .post('/auth/register')
            .set('X-device', 'aaa')
            .send(data)
            .expect(error.statusCode)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.body).to.deep.equal({
                    "status": false,
                    "error": {
                        "code": error.code,
                        "message": error.message,
                        "data": {
                            "error": "The username must have numbers, letters, '-', '.' and '_'"
                        }
                    }
                })
                done()
            })
    })

    it('should response ko (register invalid espace in username)',function(done){
        let error = new exception.ValidationUsername()
        let data = {
            "email": validUser.email,
            "password": validUser.password,
            "username": '1234 5678'
        }

        request
            .post('/auth/register')
            .set('X-device', 'aaa')
            .send(data)
            .expect(error.statusCode)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.body).to.deep.equal({
                    "status": false,
                    "error": {
                        "code": error.code,
                        "message": error.message,
                        "data": {
                            "error": "The username must have numbers, letters, '-', '.' and '_'"
                        }
                    }
                })
                done()
            })
    })

    it('should response ok (register)',function(done){
        request
            .post('/auth/register')
            .set('X-device', 'aaa')
            .send(validUser)
            .expect(200)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.body.status).to.be.true
                expect(res.body.data).to.have.property('token')
                expect(res.body.data).to.have.property('user')
                expect(res.body.data.user.email).to.be.equal(validUser.email)
                expect(res.body.data.user.username).to.be.equal(validUser.username)
                done()
            })
    })

    it('should response ko (register email already exist)',function(done){
        let error = new exception.ValidationRegistration()

        request
            .post('/auth/register')
            .set('X-device', 'aaa')
            .send(validUser)
            .expect(error.statusCode)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.body).to.deep.equal({
                    "status": false,
                    "error": {
                        "code": error.code,
                        "message": error.message,
                        "data": {
                            "error": "That email address is already in use."
                        }
                    }
                })
                done()
            })
    })

    it('should response ko (register username already exist)',function(done){
        let error = new exception.ValidationRegistration()
        let data = {
            "email": faker.internet.email().toLowerCase(),
            "password": validUser.password,
            "username": validUser.username
        }

        request
            .post('/auth/register')
            .set('X-device', 'aaa')
            .send(data)
            .expect(error.statusCode)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.body).to.deep.equal({
                    "status": false,
                    "error": {
                        "code": error.code,
                        "message": error.message,
                        "data": {
                            "error": "That username is already in use."
                        }
                    }
                })
                done()
            })
    })

    it('should response ok (login with email)',function(done){
        let data = {
            "email": validUser.email,
            "password": validUser.password,
        }

        request
            .post('/auth/login')
            .set('X-device', 'aaa')
            .send(data)
            .expect(200)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.body.status).to.be.true
                expect(res.body.data.user.email).to.be.equal(validUser.email)
                expect(res.body.data.user.username).to.be.equal(validUser.username)
                expect(res.body.data.token).to.be.an('string')
                validToken = res.body.data.token
                done()
            })
    })

    it('should response ok (login with username)',function(done){
        let data = {
            "username": validUser.username,
            "password": validUser.password,
        }

        request
            .post('/auth/login')
            .set('X-device', 'aaa')
            .send(data)
            .expect(200)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.body.status).to.be.true
                expect(res.body.data.user.email).to.be.equal(validUser.email)
                expect(res.body.data.user.username).to.be.equal(validUser.username)
                expect(res.body.data.token).to.be.an('string')
                validToken = res.body.data.token
                done()
            })
    })

    it('should response ko (login invalid password)',function(done){
        let error = new exception.ValidationLogin()
        let data = {
            "email": validUser.email,
            "password": faker.internet.password(),
        }

        request
            .post('/auth/login')
            .set('X-device', 'aaa')
            .send(data)
            .expect(error.statusCode)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.body).to.deep.equal({
                    "status": false,
                    "error": {
                        "code": error.code,
                        "message": error.message,
                        "data": {
                            "error": "Your login details could not be verified. Please try again."
                        }
                    }
                })
                done()
            })
    })

    it('should response ko (login invalid empty username and password)',function(done){
        let error = new exception.ValidationLogin()
        let data = {
            "email": '',
            "password": '',
        }

        request
            .post('/auth/login')
            .set('X-device', 'aaa')
            .send(data)
            .expect(error.statusCode)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.body).to.deep.equal({
                    "status": false,
                    "error": {
                        "code": error.code,
                        "message": error.message,
                        "data": {
                            "error": "Your login details could not be verified. Please try again."
                        }
                    }
                })
                done()
            })
    })

    it('should response ok (logged)',function(done){
        request
            .get('/logged')
            .set('X-device', 'aaa')
            .set('Authorization', validToken)
            .expect(200)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.body.status).to.be.true
                done()
            })
    })

    it('should response ko (logged with invalid token)',function(done){
        let error = new exception.ValidationPublicKeyFailed()

        request
            .get('/logged')
            .set('X-device', 'aaa')
            .set('Authorization', validToken + 'aaa')
            .expect(error.statusCode)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.body).to.deep.equal({
                    "status": false,
                    "error": {
                        "code": error.code,
                        "message": error.message
                    }
                })
                done()
            })
    })

    it('should response ko (logged with invalid device)',function(done){
        let error = new exception.ValidationPublicKeyFailed()

        request
            .get('/logged')
            .set('X-device', 'bbb')
            .set('Authorization', validToken)
            .expect(error.statusCode)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.body).to.deep.equal({
                    "status": false,
                    "error": {
                        "code": error.code,
                        "message": error.message
                    }
                })

                done()
            })
    })

    it('should response ko (change password invalid new password)',function(done){
        let error = new exception.ValidationPassword()

        let data = {
            "email": validUser.email,
            "password": validUser.password,
            "newPassword": 'aaa'
        }

        request
            .post('/auth/change-password')
            .set('X-device', 'aaa')
            .set('Authorization', validToken)
            .send(data)
            .expect(403)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.body).to.deep.equal({
                    "status": false,
                    "error": {
                        "code": error.code,
                        "message": error.message,
                        "data": {
                            "error": "You must set 8 or more characters for password."
                        }
                    }
                })
                done()
            })
    })

    it('should response ok (change password)',function(done){
        let data = {
            "email": validUser.email,
            "password": validUser.password,
            "newPassword": newPassword
        }

        request
            .post('/auth/change-password')
            .set('X-device', 'aaa')
            .set('Authorization', validToken)
            .send(data)
            .expect(200)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.body.status).to.be.true
                expect(res.body.data.user.email).to.be.equal(validUser.email)
                expect(res.body.data.user.username).to.be.equal(validUser.username)
                expect(res.body.data.token).to.be.an('string')
                newValidToken = res.body.data.token
                done()
            })
    })

    it('should response ko (login using old password)',function(done){
        let error = new exception.ValidationLogin()

        let data = {
            "username": validUser.username,
            "password": validUser.password,
        }

        request
            .post('/auth/login')
            .set('X-device', 'aaa')
            .send(data)
            .expect(error.statusCode)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.body).to.deep.equal({
                    "status": false,
                    "error": {
                        "code": error.code,
                        "message": error.message,
                        "data": {
                            "error": "Your login details could not be verified. Please try again."
                        }
                    }
                })
                done()
            })
    })

    it('should response ko (logged with old token)',function(done){
        let error = new exception.ValidationPublicKeyFailed()

        request
            .get('/logged')
            .set('X-device', 'aaa')
            .set('Authorization', validToken)
            .expect(error.statusCode)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.body).to.deep.equal({
                    "status": false,
                    "error": {
                        "code": error.code,
                        "message": error.message
                    }
                })

                done()
            })

    })

    it('should response ok (logged with new token)',function(done){
        request
            .get('/logged')
            .set('X-device', 'aaa')
            .set('Authorization', newValidToken)
            .expect(200)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.body.status).to.be.true
                done()
            })

    })

    it('should response ok (login new password)',function(done){
        let data = {
            // "email": validUser.email,
            "username": validUser.username,
            "password": newPassword,
        }

        request
            .post('/auth/login')
            .set('X-device', 'aaa')
            .send(data)
            .expect(200)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.body.status).to.be.true
                expect(res.body.data.user.email).to.be.equal(validUser.email)
                expect(res.body.data.user.username).to.be.equal(validUser.username)
                expect(res.body.data.token).to.be.an('string')
                validToken = res.body.data.token
                done()
            })
    })
})

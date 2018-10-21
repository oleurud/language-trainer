'use strict';

const expect = require('chai').expect
const request = require('supertest').agent(testApp)
const faker = require('faker')
const exception = requireRoot('services/customExceptions')
const debug = require('debug')('app:test:functional:index')

let validUser
let validToken
let validPayment

describe('FUNCTIONAL API - USER', function(){

    it('should response ok (register)',function(done){
        let data = validUser = {
            "email": faker.internet.email().toLowerCase(),
            "password": faker.internet.password(),
            "username": faker.internet.userName().toLowerCase()
        }

        request
            .post('/auth/register')
            .set('X-device', 'aaa')
            .send(data)
            .expect(200)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.body.status).to.be.true
                expect(res.body.data).to.have.property('token')
                validToken = res.body.data.token
                expect(res.body.data).to.have.property('user')
                expect(res.body.data.user.email).to.be.equal(data.email)
                expect(res.body.data.user.email).to.be.equal(data.email)
                expect(res.body.data.user.username).to.be.equal(data.username)
                done()
            })
    })

    it('should response ok (profile)',function(done){
        request
            .get('/user')
            .set('X-device', 'aaa')
            .set('Authorization', validToken)
            .expect(200)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.body.status).to.be.true
                expect(res.body.data.email).to.be.equal(validUser.email)
                expect(res.body.data.username).to.be.equal(validUser.username)
                expect(res.body.data.role).to.be.equal('Client')
                done()
            })
    })

    it('should response ok (set profile)',function(done){
        let data = {
            "name": faker.name.firstName(),
            "lastname": faker.name.lastName(),
            "image": faker.internet.userName()
        }

        request
            .put('/user')
            .set('X-device', 'aaa')
            .set('Authorization', validToken)
            .send(data)
            .expect(200)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.body.status).to.be.true
                expect(res.body.data.email).to.be.equal(validUser.email)
                expect(res.body.data.username).to.be.equal(validUser.username)
                expect(res.body.data.role).to.be.equal('Client')
                expect(res.body.data).to.have.property('profile')
                expect(res.body.data.profile).to.be.deep.equal(data)

                validUser = Object.assign(data, validUser)
                done()
            })
    })

    it('should response ok (check profile updated)',function(done){
        request
            .get('/user')
            .set('X-device', 'aaa')
            .set('Authorization', validToken)
            .expect(200)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.body.status).to.be.true
                expect(res.body.data.email).to.be.equal(validUser.email)
                expect(res.body.data.username).to.be.equal(validUser.username)
                expect(res.body.data.role).to.be.equal('Client')
                expect(res.body.data).to.have.property('profile')
                expect(res.body.data.profile.name).to.be.equal(validUser.name)
                expect(res.body.data.profile.lastname).to.be.equal(validUser.lastname)
                expect(res.body.data.profile.image).to.be.equal(validUser.image)
                done()
            })
    })

})

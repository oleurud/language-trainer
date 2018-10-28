'use strict';

const expect = require('chai').expect
const request = require('supertest').agent(testApp)
const faker = require('faker')
const {slugify} = requireRoot('services/utils')
const { getSuperAdminUser } = require('../helper')
const exception = requireRoot('services/customExceptions')
const debug = require('debug')('app:test:functional:index')

let validUser
let validToken
let validContent
let validTopic
const pagination = {
    page: 1,
    limit: 25
}

describe('FUNCTIONAL API - TOPIC', function(){

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

    describe('superadmin', function() {
        before(async function() {
            await getSuperAdminUser(validUser.email)
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

        it('should response ok (create Content)', function (done) {
            let data = validContent = {
                name: faker.lorem.sentence()
            }

            request
                .post('/content')
                .set('X-device', 'aaa')
                .set('Authorization', validToken)
                .send(data)
                .expect(200)
                .end(function (err, res) {
                    validContent.slug = slugify(validContent.name)
                    expect(err).to.be.null
                    expect(res.body.status).to.be.true
                    expect(res.body.data).to.be.deep.equal(validContent)
                    done()
                })
        })

        it('should response ok (get topics empty)', function (done) {
            request
                .get(`/content/${validContent.slug}/topic`)
                .set('X-device', 'aaa')
                .set('Authorization', validToken)
                .expect(200)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res.body.status).to.be.true
                    expect(res.body.data).to.have.property('topics')
                    expect(res.body.data.topics).to.be.an('Array').to.be.empty
                    expect(res.body.data).to.have.property('pagination')
                    expect(res.body.data.pagination).to.be.deep.equal(pagination)
                    done()
                })
        })

        it('should response ok (add topic)', function (done) {
            let data = validTopic = {
                name: faker.lorem.sentence()
            }

            request
                .post(`/content/${validContent.slug}/topic`)
                .set('X-device', 'aaa')
                .set('Authorization', validToken)
                .send(data)
                .expect(200)
                .end(function (err, res) {
                    validTopic.slug = slugify(validTopic.name)
                    expect(err).to.be.null
                    expect(res.body.status).to.be.true
                    expect(res.body.data).to.be.deep.equal(validTopic)
                    done()
                })
        })

        it('should response ok (exists 1 topic)', function (done) {
            request
                .get(`/content/${validContent.slug}/topic`)
                .set('X-device', 'aaa')
                .set('Authorization', validToken)
                .expect(200)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res.body.status).to.be.true
                    expect(res.body.data).to.have.property('topics')
                    expect(res.body.data.topics).to.be.an('Array')
                    expect(res.body.data.topics[0]).to.be.deep.equal(validTopic)
                    expect(res.body.data).to.have.property('pagination')
                    expect(res.body.data.pagination).to.be.deep.equal(pagination)
                    done()
                })
        })

        it('should response ok (topic exists)', function (done) {
            request
                .get(`/content/${validContent.slug}/topic/${validTopic.slug}`)
                .set('X-device', 'aaa')
                .set('Authorization', validToken)
                .expect(200)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res.body.status).to.be.true
                    expect(res.body.data).to.be.deep.equal(validTopic)
                    done()
                })
        })

        it('should response ko (topic not exists)', function (done) {
            let error = new exception.TopicNotExists()

            request
                .get(`/content/${validContent.slug}/topic/${validTopic.slug}-not-exists`)
                .set('X-device', 'aaa')
                .set('Authorization', validToken)
                .expect(error.statusCode)
                .end(function (err, res) {
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

        it('should response ok (add topic with the same name)', function (done) {
            let error = new exception.ValidationTopicName()

            request
                .post(`/content/${validContent.slug}/topic`)
                .set('X-device', 'aaa')
                .set('Authorization', validToken)
                .send(validTopic)
                .expect(error.statusCode)
                .end(function (err, res) {
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

        it('should response ok (remove topic)', function (done) {
            request
                .delete(`/content/${validContent.slug}/topic/${validTopic.slug}`)
                .set('X-device', 'aaa')
                .set('Authorization', validToken)
                .expect(200)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res.body.status).to.be.true
                    expect(res.body.data).to.be.true
                    done()
                })
        })

        it('should response ko (getting removed topic)', function (done) {
            let error = new exception.TopicNotExists()

            request
                .get(`/content/${validContent.slug}/topic/${validTopic.slug}`)
                .set('X-device', 'aaa')
                .set('Authorization', validToken)
                .expect(error.statusCode)
                .end(function (err, res) {
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

        it('should response ok (get topics after remove existing topic)', function (done) {
            request
                .get(`/content/${validContent.slug}/topic`)
                .set('X-device', 'aaa')
                .set('Authorization', validToken)
                .expect(200)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res.body.status).to.be.true
                    expect(res.body.data).to.have.property('topics')
                    expect(res.body.data.topics).to.be.an('Array').to.be.empty
                    expect(res.body.data).to.have.property('pagination')
                    expect(res.body.data.pagination).to.be.deep.equal(pagination)
                    done()
                })
        })

        it('should response ok (remove content)', function (done) {
            request
                .delete('/content/' + validContent.slug)
                .set('X-device', 'aaa')
                .set('Authorization', validToken)
                .expect(200)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res.body.status).to.be.true
                    expect(res.body.data).to.be.true
                    done()
                })
        })
    })
})

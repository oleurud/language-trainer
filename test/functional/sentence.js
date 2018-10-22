'use strict';

const expect = require('chai').expect
const request = require('supertest').agent(testApp)
const faker = require('faker')
const {slugify} = requireRoot('services/utils')
const exception = requireRoot('services/customExceptions')
const debug = require('debug')('app:test:functional:index')

let validUser
let validToken
let validContent
let validTopic
let validSentence
const pagination = {
    page: 1,
    limit: 25
}

describe('FUNCTIONAL API - SENTENCE', function(){

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

    it('should response ok (create topic)', function (done) {
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

    it('should response ok (get sentences by content empty)', function (done) {
        request
            .get(`/sentence/content/${validContent.slug}`)
            .set('X-device', 'aaa')
            .set('Authorization', validToken)
            .expect(200)
            .end(function (err, res) {
                expect(err).to.be.null
                expect(res.body.status).to.be.true
                expect(res.body.data).to.have.property('sentences')
                expect(res.body.data.sentences).to.be.an('Array').to.be.empty
                expect(res.body.data).to.have.property('pagination')
                expect(res.body.data.pagination).to.be.deep.equal(pagination)
                done()
            })
    })

    it('should response ok (get sentences by slug empty)', function (done) {
        request
            .get(`/sentence/content/${validContent.slug}/topic/${validTopic.slug}`)
            .set('X-device', 'aaa')
            .set('Authorization', validToken)
            .expect(200)
            .end(function (err, res) {
                expect(err).to.be.null
                expect(res.body.status).to.be.true
                expect(res.body.data).to.have.property('sentences')
                expect(res.body.data.sentences).to.be.an('Array').to.be.empty
                expect(res.body.data).to.have.property('pagination')
                expect(res.body.data.pagination).to.be.deep.equal(pagination)
                done()
            })
    })

    it('should response ok (add sentence)', function (done) {
        let data = validSentence = {
            source: faker.lorem.sentence(),
            translation: faker.lorem.sentence()
        }

        request
            .post(`/sentence/content/${validContent.slug}/topic/${validTopic.slug}`)
            .set('X-device', 'aaa')
            .set('Authorization', validToken)
            .send(data)
            .expect(200)
            .end(function (err, res) {
                expect(err).to.be.null
                expect(res.body.status).to.be.true
                validSentence.id = res.body.data.id
                expect(res.body.data).to.be.deep.equal(validSentence)
                done()
            })
    })

    it('should response ok (get sentences by content exists 1 sentence)', function (done) {
        request
            .get(`/sentence/content/${validContent.slug}`)
            .set('X-device', 'aaa')
            .set('Authorization', validToken)
            .expect(200)
            .end(function (err, res) {
                expect(err).to.be.null
                expect(res.body.status).to.be.true
                expect(res.body.data).to.have.property('sentences')
                expect(res.body.data.sentences).to.be.an('Array')
                expect(res.body.data.sentences[0]).to.be.deep.equal(validSentence)
                expect(res.body.data).to.have.property('pagination')
                expect(res.body.data.pagination).to.be.deep.equal(pagination)
                done()
            })
    })

    it('should response ok (get sentences by slug exists 1 sentence)', function (done) {
        request
            .get(`/sentence/content/${validContent.slug}/topic/${validTopic.slug}`)
            .set('X-device', 'aaa')
            .set('Authorization', validToken)
            .expect(200)
            .end(function (err, res) {
                expect(err).to.be.null
                expect(res.body.status).to.be.true
                expect(res.body.data).to.have.property('sentences')
                expect(res.body.data.sentences).to.be.an('Array')
                expect(res.body.data.sentences[0]).to.be.deep.equal(validSentence)
                expect(res.body.data).to.have.property('pagination')
                expect(res.body.data.pagination).to.be.deep.equal(pagination)
                done()
            })
    })

    it('should response ok (remove sentence)', function (done) {
        request
            .delete(`/sentence/${validSentence.id}`)
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

    it('should response ko (sentence not exists)', function (done) {
        let error = new exception.SentenceNotExists()

        request
            .delete(`/sentence/${validSentence.id}`)
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

'use strict'

const expect = require('chai').expect
const request = require('supertest').agent(testApp)
const exception = requireRoot('services/customExceptions')
const debug = require('debug')('app:test:functional:index')


describe('FUNCTIONAL API - INDEX', function(){

    it('should response ok (status)',function(done){
        request
            .get('/')
            .set('X-device', 'aaa')
            .expect(200)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res.body).to.deep.equal({
                    "status": true,
                    "data": "hi"
                })
                done()
            })
    })

    it('should response ko (not logged)',function(done){
        let error = new exception.ValidationPublicKeyFailed()

        request
            .get('/logged')
            .set('X-device', 'aaa')
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

    it('should response ko (not device header)',function(done){
        let error = new exception.ValidationDeviceFailed()

        request
            .get('/')
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
})

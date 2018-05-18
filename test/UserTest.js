var expect  = require('chai').expect;
var assert = require('chai').assert;
var request = require('request');
var chai = require('chai')
  , chaiHttp = require('chai-http');
chai.use(chaiHttp);
// Add promise support if this does not exist natively.
if (!global.Promise) {
    global.Promise = require('q');
}
var chai = require('chai');
chai.use(require('chai-http'));
var port = 'http://localhost:3030' || 'https://e-food-system.herokuapp.com';

describe('User', function () {
    it('User Login', function (done) { // <= Pass in done callback
        var agent = chai.request.agent(port)
        agent
            .post('/api/userlogin')
            .send({
                logusername: 'user1',
                logpassword: 'user'
            })
            .then(function (res) {
                expect(res).to.redirect;
                expect(res).to.redirectTo(port + '/api/userprofile');
                // The `agent` now has the sessionid cookie saved, and will send it
                // back to the server in the next request:
                return agent.get('/api/userprofile')
                    .then(function (res) {
                        assert.isOk(res, 'everything is ok');
                        assert.isNotOk(res.statusCode === 404, 'this will fail');
                        assert.isNotNull(res, 'response is not null!');
                        assert.isObject(res.body, 'response body is an object');
                        assert.isNotArray(res.body, 'response body is not array');
                        expect(res).to.have.status(200);
                        expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
                        expect(res).to.have.headers;
                        expect(res).to.be.json;
                        expect(res).to.not.redirect;
                        expect('127.0.0.1').to.be.an.ip;
                        done();
                    });
            });
    });
    it('User Menu', function (done) { // <= Pass in done callback
        var agent = chai.request.agent(port)
        agent
            .post('/api/userlogin')
            .send({
                logusername: 'user1',
                logpassword: 'user'
            })
            .then(function (res) {
                return agent.get('/api/userdishes')
                  .then(function (res) {
                    assert.isOk(res, 'everything is ok');
                    assert.isNotOk(res.statusCode === 404, 'this will fail');
                    assert.isNotNull(res, 'response is not null!');
                    assert.isNotObject(res.body, 'response body is not an object');
                    assert.isArray(res.body, 'response body is an Array');
                    assert.isString(res.body[0].ingredient, 'response body ingredient is a string');
                    assert.isNumber(res.body[0].price, 'response body price is number');
                    assert.isBoolean(res.body[4].diabetes, 'respose body diabetes is Boolean');
                    expect(res).to.have.status(200);
                    expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
                    expect(res).to.have.headers;
                    expect(res).to.be.json;
                    expect(res).to.not.redirect;
                    expect('127.0.0.1').to.be.an.ip;
                    done();
                  });
              });
    });

    it('The root page content', function(done) {
        request(port , function(err, res, body) {
            //console.log(res.headers);
            expect(body).to.equal('Welcome to e-Food system. Please choose /api/route');
            expect(res).to.not.have.status(400);
            expect(res).to.have.status(200);
            expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
            expect(res).to.have.headers;
            expect(res).to.be.html;
            expect(res).to.not.redirect;
            expect('127.0.0.1').to.be.an.ip;
            assert.isNull(err, 'error is null!');
            assert.isOk(res, 'everything is ok');
            assert.isNotOk(res.statusCode === 404, 'this will fail');
            assert.isNotNull(res, 'response is not null!');
            assert.typeOf(res, 'object', 'res is a string message');
            assert.typeOf(res.body, 'string', 'res is a string message');
            assert.isNotArray(res.body, 'response body is not an Array');
            //console.log(res.headers);
            done();
        });
    });
    it('The User Logout', function(done) {
        var agent = chai.request.agent(port)
        agent
            .post('/api/userlogin')
            .send({
                logusername: 'user1',
                logpassword: 'user'
            })
            .then(function (res) {
                expect(res).to.redirect;
                return agent.get('/api/userlogout')
                  .then(function (res) {
                    expect(res).to.redirect;
                    expect(res).to.redirectTo(port + '/');
                    assert.isOk(res, 'everything is ok');
                    assert.isNotOk(res.statusCode === 404, 'this will fail');
                    assert.isNotNull(res, 'response is not null!');
                    assert.isObject(res.body, 'response body is an object');
                    assert.isNotArray(res.body, 'response body is not an Array');
                    expect(res).to.have.status(200);
                    //console.log(res.headers);
                    expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                    expect(res).to.have.headers;
                    expect(res).to.be.html;
                    expect('127.0.0.1').to.be.an.ip;
                    done();
                  });
              });
    });

    it('User get pendin gorders status without loging', function(done) {
        request(port+'/api/userpendingorders' , function(err, res, body) {
            //console.log(body);
            expect(res.statusCode).to.equal(400);
            expect(body).to.equal('Not authorized! Go back!');
            done();
        });
    });
    
    it('User profile without login', function(done) {
        request(port+'/api/userprofile' , function(err, res, body) {
            //console.log(res.body);
            expect(res.statusCode).to.equal(400);
            assert.typeOf(res, 'object', 'we have an authentication message');
            assert.isNotNull(res, 'response is not null!');
            assert.isNull(err, 'response is not null!');
            assert.equal(body, 'Not authorized! Go back!', 'Authentication Message');
            done();
        });
    });
});


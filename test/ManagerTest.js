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

describe('Manager', function () {
    it('Manager Login', function (done) { // <= Pass in done callback
        var agent = chai.request.agent(port)
        agent
            .post('/api/mgrlogin')
            .send({
                logmgr_name: 'test_mgr',
                logpassword: '1234'
            })
            .then(function (res) {
                expect(res).to.redirect;
                expect(res).to.redirectTo(port + '/api/mgrprofile');
                // The `agent` now has the sessionid cookie saved, and will send it
                // back to the server in the next request:
                return agent.get('/api/mgrprofile')
                    .then(function (res) {
                        assert.isOk(res, 'everything is ok');
                        assert.isNotOk(res.statusCode === 404, 'if the status is 404 it will fail');
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
    it('Manager Order List', function (done) { // <= Pass in done callback
        var agent = chai.request.agent(port)
        agent
        .post('/api/mgrlogin')
        .send({
            logmgr_name: 'test_mgr',
            logpassword: '1234'
        })
        .then(function (res) {
            return agent.get('/api/mgrorderlist')
                  .then(function (res) {
                    //console.log(res.body);
                    assert.isOk(res, 'everything is ok');
                    assert.isNotOk(res.statusCode === 404, 'this will fail');
                    assert.isNotNull(res, 'response is not null!');
                    assert.isNotObject(res.body, 'response body is not an object');
                    assert.isArray(res.body, 'response body is an Array');
                    assert.isString(res.body[0].address, 'response body address is a string');
                    assert.isNumber(res.body[0].check_no, 'response body check No is a number');
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

    it('The Manager Logout', function(done) {
        var agent = chai.request.agent(port)
        agent
            .post('/api/mgrlogin')
            .send({
                logusername: 'test_mgr',
                logpassword: '1234'
            })
            .then(function (res) {
                return agent.get('/api/mgrlogout')
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
    it('Manager get deliver list status without loging', function(done) {
        request(port+'/api/mgrdeliveredlist' , function(err, res, body) {
            //console.log(body);
            expect(res.statusCode).to.equal(400);
            expect(body).to.equal('Not authorized! Go back!');
            done();
        });
    });
    
    it('Manger profile without login', function(done) {
        request(port+'/api/mgrprofile' , function(err, res, body) {
            //console.log(res.body);
            expect(res.statusCode).to.equal(400);
            assert.typeOf(res, 'object', 'we have an authentication message');
            assert.isNotNull(res, 'response is not null!');
            assert.isNull(err, 'response is not null!');
            assert.equal(body, 'Manager not found! Not authorized! Go back!', 'Authentication Message');
            done();
        });
    });
});


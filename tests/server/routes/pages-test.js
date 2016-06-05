var expect = require('chai').expect;

var supertest = require('supertest');
var app = require('../../../server/app');
var agent = supertest(app);


describe('Page route', function () {
  
  it('GET /api/pages to exist', function (done) {
    agent
      .get('/api/pages')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

  it('PUT /api/pages to exist', function (done) {
    agent
      .put('/api/pages')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

});
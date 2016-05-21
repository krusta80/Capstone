// Instantiate all models
var expect = require('chai').expect;

var supertest = require('supertest');
var app = require('../../../server/app');
var agent = supertest(app);

describe('scraper works', function () {
  it('POST /scrape/site', function (done) {
    agent
      .post('/api/scrape/site')
      .send({ url: "http://www.google.com" })
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        expect(res.body.publicDirectory.slice(0,7)).to.equal('/public');
        done();
      })
  });
});
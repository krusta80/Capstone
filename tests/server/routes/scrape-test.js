// Instantiate all models
var expect = require('chai').expect;

var supertest = require('supertest');
var app = require('../../../server/app');
var agent = supertest(app);

describe('scraper download works', function () {
  xit('POST /scrape/download', function (done) {
    agent
      .post('/api/scrape/download')
      .send({ url: "http://www.google.com" })
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        expect(res.body.publicDirectory.slice(0,7)).to.equal('/public');
        done();
      })
  });
});

describe('proxy scraper works', function () {
  it('GET /scrape/proxy', function (done) {
    agent
      .get('/api/scrape/proxy?url=http://www.google.com')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        expect(res.text).to.exist;
        expect(res.text).to.have.length.above(100);
        expect(res.text.indexOf('img')).to.be.above(0);
        done();
      })
  });
});
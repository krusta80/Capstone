var expect = require('chai').expect;

var supertest = require('supertest');
require('../../../server/db/models');
var app = require('../../../server/app');
var mongoose = require('mongoose');
var Page = mongoose.model('Page');
var Job = mongoose.model('Job');
var agent = supertest(app);
var dbURI = 'mongodb://localhost/fsg-app';

//remember to run 'node seed.js' first

describe('backend scraper route tests', function(){
  this.timeout(50000);
  before('Establish DB connection', function (done) {
    if (mongoose.connection.db) return done();
    mongoose.connect(dbURI, done);
  });
  it('runs a job', function(done){
    Page.find({})
    .then(function(pages){
      var ids = pages.map(i=>i._id);
      return Job.create({
        title: 'test job',
        pages: ids
      });
    })
    .then(function(job){

      agent
        .post('/api/jobs/' + job._id + '/run').expect(200)
        .end(function(err, res){
          done();
        });
    })
    .catch(function(err){
      console.log(err);
      done();
    });
  });
});

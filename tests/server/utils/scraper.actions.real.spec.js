require('../../../server/db/models');
var chai = require('chai').expect,
  mongoose = require('mongoose'),
  Page = mongoose.model('Page'),
  Job = mongoose.model('Job'),
  Hist = mongoose.model('ScraperElementHist'),
  ScraperElem = mongoose.model('ScraperElement'),
  Promise = require('bluebird');

describe('run job with pre-actions', function(){
  this.timeout(60000);
  var job;
  before(function(done){
    mongoose.connect('mongodb://localhost/capstone')
    .then(function(){
      return Promise.join(Page.remove(), Job.remove(), Hist.remove() );
    })
    .then(function(){
      return ScraperElem.find();
    })
    .then(function(scraperElements){
      scraperElements.forEach(i=>i.selectorIndex = 0);
      return Page.create({
        title: 'test page',
        url: 'http://www.msnbc.com',
        targetElements: scraperElements
      });
    })
    .then(function(page){
      console.log(page);
      return Job.create({
        title: 'test job',
        pages: [page._id]
      });
    })
    .then(function(_job){
      //remember to populate pages!
      return Job.findById(_job._id).populate('pages');
    })
    .then(function(_job){
      job = _job;
      done();
    })
    .catch(function(err){
      console.log(err);
    });
  });
  it('runs a job with pages with actions', function(done){
    job.runJob()
    .then(function(results){
      console.log(results);
      done();
    });
  });
});

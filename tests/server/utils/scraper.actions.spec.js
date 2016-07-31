require('../../../server/db/models');
var chai = require('chai').expect,
  mongoose = require('mongoose'),
  pageData = require('../seeds/pageActions'),
  Page = mongoose.model('Page'),
  Job = mongoose.model('Job'),
  Hist = mongoose.model('ScraperElementHist'),
  Promise = require('bluebird');

xdescribe('run job with pre-actions', function(){
  this.timeout(60000);
  var job;
  before(function(done){
    mongoose.connect('mongodb://localhost/fsg-app')
    .then(function(){
      return Promise.join(Page.remove(), Job.remove(), Hist.remove() );
    })
    .then(function(){
      return Page.create(pageData);
    })
    .then(function(page){
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

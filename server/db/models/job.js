
var mongoose = require('mongoose');
var Page = mongoose.model('Page').schema;
var Scraper = require('../../app/utils/scraperBasic');
var Promise = require('bluebird');

var jobSchema = mongoose.Schema({
  title: {
    type: String,
		required: true
  },
 	description: {
	    type: String
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
  pages: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Page'
	}],
  active: {
    type: Boolean,
    required: true,
    default: false
  },
  frequency: {
    type: Number
  },
  isRunning: {
    type: Boolean,
    default: false
  },
  lastRun: {
  	type: Date
  }
},
{
  timestamps: true
});

function Results(id){
  this.pages = {};
  this.jobId = id;
  this.pageCount = 1;
}
jobSchema.methods.runJob = function(){
  if(this.isRunning)
    return;
  this.isRunning = true;
  var results = new Results(this._id);
  var instance = this;
  return Promise.map(instance.pages, function(page){
    results.pages[page._id] = null;
    var scraper = new Scraper(page);
    return scraper.go(10000, results);
  })
  .then(function(){
    this.isRunning = false;
    this.lastRun = Date.now();
    return results;
  })
  .catch(function(err){
    console.log(err);
  });

};
mongoose.model('Job', jobSchema);

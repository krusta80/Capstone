
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
}
jobSchema.methods.runJob = function(){
  var results = new Results(this._id);
  var instance = this;
  return Promise.map(instance.pages, function(page){
    results.pages[page._id] = null;
    var scraper = new Scraper(page);
    return scraper.go(10000, results);
  })
  .then(function(){
    return results;
  });

};
mongoose.model('Job', jobSchema);

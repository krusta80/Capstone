
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
  runHistory: [String],
  active: {
    type: Boolean,
    required: true,
    default: false
  },
  frequency: {
    type: String
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

jobSchema.methods.runJob = function(project, override){
  var runId = mongoose.Types.ObjectId();
  var dd = new Date(this.lastRun);
  console.log("Attempting to run job id", this._id, "(", Date.now(), ")");
  console.log("   -> Is running:",this.isRunning);
  console.log("   -> Last RunTS:",dd);
  console.log("   -> Frequency :",this.frequency);

  if(!override && (this.isRunning || Date.now() - dd < parseInt(this.frequency)*60000)) {
    console.log("JOB EITHER RUNNING OR RUN TOO RECENTLY!!");
    return;
  }
  this.isRunning = true;
  var results = new Results(this._id);
  results.runId= runId;
  var instance = this;
  return project.save()
        .then(function(proj2) {
          project = proj2;
          return Promise.map(instance.pages, function(page){
          results.pages[page._id] = null;
          var scraper = new Scraper(page);
          return scraper.go(10000, results);
        });
        })
        .then(function(){
          instance.isRunning = false;
          results.runAt = Date.now();
          instance.runHistory.push(JSON.stringify(results));
          instance.lastRun = Date.now();
          var model = mongoose.model('ScraperElementHist');
          return Promise.join(project.save(), model.stamp());
        })
        .then(function(){
          return results;
        })
        .catch(function(err){
          console.log(err);
        });

};
mongoose.model('Job', jobSchema);

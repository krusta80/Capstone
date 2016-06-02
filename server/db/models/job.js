'use strict';
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
  },
	createdDate: {
    type: Date,
    default: Date.now
  },
  modifiedDate: {
    type: Date,
    default: Date.now
  }
});

jobSchema.methods.runJob = function(){
  var instance = this, results = {};
  return Promise.map(instance.pages, function(page){
    var scraper = new Scraper(page.url);
  });

};
module.exports = mongoose.model('Job', jobSchema);

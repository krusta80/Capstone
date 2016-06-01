'use strict';
var mongoose = require('mongoose');
var Page = mongoose.model('Page').schema;

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

module.exports = mongoose.model('Job', jobSchema);
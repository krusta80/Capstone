'use strict';
var mongoose = require('mongoose');

var Page = mongoose.model('Page').schema;

var chartTypes = ['scatterChart', 'discreteBarChart'];

var chartSchema = new mongoose.Schema({
	name: {
    	type: String,
    	required: true
  },
	project: {
    	type: mongoose.Schema.Types.ObjectId,
    	ref: 'Project', required: true
  },
	job: {
    	type: mongoose.Schema.Types.ObjectId,
    	ref: 'Job',
    	required: true
  },
	pages: {
    	type: [Page],
    	required: true
  },
	chartType: {
    	type: String,
    	enum: chartTypes
  },
	historical: {
    	type: Boolean,
    	default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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

mongoose.model('Chart', chartSchema);

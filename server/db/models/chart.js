'use strict';
var mongoose = require('mongoose');

var Page = mongoose.model('Page').schema;

var chartTypes = ['scatterChart', 'barChart', 'lineChart'];

var chartSchema = new mongoose.Schema({
	name: {
    	type: String,
    	required: true
  },
	project: {
    	type: mongoose.Schema.Types.ObjectId,
    	ref: 'Project'
  },
	job: {
    	type: mongoose.Schema.Types.ObjectId,
    	ref: 'Job'
  },
	pages: {
    	type: [Page]
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

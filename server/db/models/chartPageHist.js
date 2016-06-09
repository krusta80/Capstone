'use strict';
var mongoose = require('mongoose');

var chartPageHistSchema = mongoose.Schema({
	page: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Page'
	},
	xElem: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'ScraperElementHist'
	},
	xSubElem: {
		type: String
	},
	yElem: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'ScraperElementHist'
	},
	ySubElem: {
		type: String
	},
	weight: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'ScraperElementHist'
	},
	WeightSubElem: {
		type: String
	},
	grouping: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'ScraperElementHist'
	},
	groupingSubElem: {
		type: String
	},
	modifiedDate: {
		type: Date,
		default: Date.now
	},
	createdDate: {
		type: Date, 
		default: Date.now
	}
});

mongoose.model('ChartPageHist', chartPageHistSchema);

'use strict';
var mongoose = require('mongoose');

var ChartPageHist = mongoose.model('ChartPageHist').schema;

var chartPageSchema = mongoose.Schema({
	page: {
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'Page'
	},
	xElem: {
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'ScraperElement'
	},
	xSubElem: {
		type: String
	},
	yElem: {
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'ScraperElement'
	},
	ySubElem: {
		type: String
	},
	weight: {
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'ScraperElement'
	},
	weightSubElem: {
		type: String
	},
	grouping: {
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'ScraperElement'
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

mongoose.exports = mongoose.model('ChartPage', chartPageSchema);
'use strict';
var mongoose = require('mongoose');

var chartBuilderPageSchema = mongoose.Schema({
	page: {type: mongoose.Schema.Types.ObjectId, ref: 'Page'},
	xElem: {type: mongoose.Schema.Types.ObjectId, ref: 'ScraperElement'},
	xSubElem: {type: String},
	yElem: {type: mongoose.Schema.Types.ObjectId, ref: 'ScraperElement'},
	ySubElem: {type: String},
	weight: {type: mongoose.Schema.Types.ObjectId, ref: 'ScraperElement'},
	WeightSubElem: {type: String},
	Grouping: {type: mongoose.Schema.Types.ObjectId, ref: 'ScraperElement'},
	GroupingSubElem: {type: String},
	modifiedDate: {type: Date, default: Date.now},
	createdDate: {type: Date, default: Date.now}
});

mongoose.exports = mongoose.model('ChartBuilderPage', chartBuilderPageSchema);
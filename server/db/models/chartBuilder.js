'use strict';
var mongoose = require('mongoose');
var Page = mongoose.model('Page').schema;

var chartTypes = ['Scatter Plot']

var chartBuilderSchema = new mongoose.Schema({
	name: {type: String, required: true},
	project: {mongoose.Schema.Types.ObjectId, ref: 'Project', required: true},
	job: {mongoose.Schema.Types.ObjectId, ref: 'Job', required: true},
	pages: {type: [Page], required: true},
	chartType: {type: String, enum: chartTypes},
	historical: {type: boolean, default: false},
	createdDate: {type: date, default: Date.now},
	modifiedDate: {type: date, default: Date.now}
});

module.exports = mongoose.model('ChartBuilder', chartBuilderSchema)
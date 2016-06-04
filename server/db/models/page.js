'use strict';
var mongoose = require('mongoose');
var ScraperElement = mongoose.model('ScraperElement').schema;

var pageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    url: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true,
        default: false
    },
    targetElements: {
        type: [ScraperElement]
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    modifiedDate: {
        type: Date,
        default: Date.now
    },
    actions: String,
    paginate:{
      type:Boolean,
      default: false
    },
    paginateSelector: String
});

module.exports = mongoose.model('Page', pageSchema);

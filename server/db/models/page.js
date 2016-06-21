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
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
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
    actions: [String],
    paginate:{
      type:Boolean,
      default: false
    },
    paginateSelector: String,
    maxPages: {
      type: Number,
      default: 1
    },
    wait:{
      type:Number,
      default: 5000
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model('Page', pageSchema);

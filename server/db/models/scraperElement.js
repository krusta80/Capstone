'use strict';
var mongoose = require('mongoose');

var scraperElementSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    domSelector: {
        type: String,
        required: true
    },
    selectorIndex: {
        type: Number,
        min: 0
    },
    fields: {
        type: String        //  this is a JSON representation of a map of columns / fields
    },
    lastScrapedTS: {
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

module.exports = mongoose.model('ScraperElement', scraperElementSchema);

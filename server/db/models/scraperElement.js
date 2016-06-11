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
    selectorIndex: Number,
    fields: {
        type: String        //  this is a JSON representation of a map of columns / fields
    },
    lastScrapedTS: {
        type: Date
    }
},
{
timestamps: true
});

module.exports = mongoose.model('ScraperElement', scraperElementSchema);

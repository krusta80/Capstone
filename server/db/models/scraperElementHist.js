'use strict';
var mongoose = require('mongoose');

var scraperElementSchema = new mongoose.Schema({
    scraperElement: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'ScraperElement'
    },
    fields: {
        type: String        //  this is a JSON representation of a map of columns / fields
    },
    jobRunTS: {
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

module.exports = mongoose.model('ScraperElementHist', scraperElementSchema);

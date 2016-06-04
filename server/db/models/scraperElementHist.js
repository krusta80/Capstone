'use strict';
var mongoose = require('mongoose');

var scraperElementSchema = new mongoose.Schema({
    scraperElement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ScraperElement'
    },
    fields: {
        type: String
        //         field0: {
        //             index: 0,                       // this is the column #
        //             value: <scraped value>           // scraped value
        //         },
        //         field3: {
        //             index: 3,
        //             value: <scraped value>
        //         }
                //  this is a JSON representation of a map of columns / fields
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

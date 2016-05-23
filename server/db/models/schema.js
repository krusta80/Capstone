'use strict';
var mongoose = require('mongoose');

var schemaSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    App: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'App',
        required: true
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

mongoose.model('Schema', schemaSchema);

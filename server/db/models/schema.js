'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        unique: true
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

mongoose.model('Schema', schema);

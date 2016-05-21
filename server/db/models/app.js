'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        unique: true
    },
    User: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
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

mongoose.model('App', schema);

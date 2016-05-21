'use strict';
var mongoose = require('mongoose');

var appSchema = new mongoose.Schema({
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

module.exports = mongoose.model('App', appSchema);

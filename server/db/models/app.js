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
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('App', appSchema);

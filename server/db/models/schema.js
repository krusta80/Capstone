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
    }
},
{
    timestamps: true
});

mongoose.model('Schema', schemaSchema);

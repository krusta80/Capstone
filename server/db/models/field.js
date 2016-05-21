'use strict';
var mongoose = require('mongoose');

var fieldSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    Schema: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Schema',
        required: true
    },
    type: {
        type: String,
        enum: ["String", "Number", "Date", "Boolean", "ObjectId", "[String]", "[Number]", "[Date]", "[Boolean]", "[ObjectId]"],
        required: true
    },
    default: {
        type: String
    },
    required: {
        type: Boolean,
        default: false
    },
    unique: {
        type: Boolean,
        default: false
    },
    select: {
        type: Boolean,
        default: true
    },
    index: {
        type: Boolean,
        default: false
    },
    sparse: {
        type: Boolean,
        default: false
    },
    min: {
        type: Number
    },
    max: {
        type: Number
    },
    enum: {
        type: [String]
    }
});

mongoose.model('Field', fieldSchema);

'use strict';
var mongoose = require('mongoose');
var Job = mongoose.model('Job').schema;

var projectSchema = mongoose.Schema({
    title: {
  		type: String, 
		  required: true
  	},
 	  description: {
	    type: String
  	},
    user: {
  		type: mongoose.Schema.Types.ObjectId, 
  		ref: 'User'
  	},
  	jobs: [Job],
  	createdDate: {
        type: Date,
        default: Date.now
    },
    modifiedDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Project', projectSchema);
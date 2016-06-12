'use strict';
var mongoose = require('mongoose');
var models = require('./db')
var Job = mongoose.model('Job');
var Project = mongoose.model('Project');

console.log("Job runner!");

var jobList = [];
Project.find({}).populate('jobs.pages')
.then(function(projects) {
	projects.forEach(function(project) {
		console.log("Project is", project);
		project.jobs.forEach(function(job) {
			if(job.active)
				jobList.push(job.runJob(project));
		});
	});
	console.log("Job list is", jobList);
	return Promise.all(jobList)
})
.then(function(resultList) {
	resultList.forEach(function(result) {
		console.log("result is",result);
	})
	process.exit();
})
.catch(function(err) {
	console.log("Error:", err);
})

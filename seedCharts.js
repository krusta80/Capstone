
var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('./server/db');
var faker = require('faker'); 
var User = mongoose.model('User');
var Chart = mongoose.model('Chart');
var ScraperElement = mongoose.model('ScraperElement');
var ScraperElementHist = mongoose.model('ScraperElementHist');
var Job = mongoose.model('Job');
var Project = mongoose.model('Project');
var Page = mongoose.model('Page');
var wipeCollections = function () {
    var removeCharts = Chart.remove({});
    var removeChartPages = ChartPage.remove({});
    return Promise.all([
        removeCharts,
        removeChartPages
    ]);
};

//Create Project
//Create Job within Project
//Create Page within Job

var createProject = function(user){
	return {
		title: 'Camera Research',
		description: 'Comparing 150 cameras across brands, prices, star averages and number of reviews.',
		user: user
	};
};

var createJob = function(){
	return {
		title: 'Amazon Job',
		user: 'obama@gmail.com'
		active: true
	};
};

var _user;
var _project;
connectToDb
    .then(function () {
        return wipeCollections();
    })
    .then(function(){
    	return User.findOne({email: 'obama@gmail.com'})
    })
    .then(function(obama) {
    	_user = obama;
    	return Project.create(createProject(_user));
    })
    .then(function(project){
    	_project = project
    	return 
    })
    .catch(function (err) {
        console.error(err);
        process.kill(1);
    });
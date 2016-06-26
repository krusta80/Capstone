
var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('./server/db');
var User = mongoose.model('User');
var Chart = mongoose.model('Chart');
var ScraperElement = mongoose.model('ScraperElement');
var ScraperElementHist = mongoose.model('ScraperElementHist');
var Job = mongoose.model('Job');
var Project = mongoose.model('Project');
var Page = mongoose.model('Page');
var wipeCollections = function () {
    var removeCharts = Chart.remove({});
    return Promise.all([
        removeCharts
    ]);
};

var generateProject = function(user){
	return {
		title: 'Camera Research',
		description: 'Comparing 150 cameras across brands, prices, star averages and number of reviews.',
		user: user,
		jobs: [generateJob(user)]
	};
};

var generateJob = function(user){
	return {
		title: 'Amazon Job',
		frequency: 60,
		user: user,
		active: true
	};
};

var generatePage = function(job){
	return {
		title: 'Listings Page',
		job: job,
		url: 'https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords=cameras',
		active: true
	};
};

var getGroup = function(groupArr){
	var groupInd = Math.floor(groupArr.length * Math.random());
	var group = groupArr[groupInd];
	var brand = groupArr[groupInd].brand;
	group.rem--;
	if(group.rem<=0){
		groupArr.splice(groupInd, 1);
	};
	return brand;
}

var getVal = function(arr){
	var ind = Math.floor(arr.length * Math.random());
	var item = arr[ind];
	var itemVal = (item.max-item.min)*Math.random()+item.min;
	item.rem--;
	if(item.rem<=0){
		arr.splice(ind, 1);
	};
	return itemVal;
}

var generateCamera = function(xArr, yArr, radArr, groupArr){
	return {
		x: getVal(xArr),
		y: getVal(yArr),
		rad: getVal(radArr),
		group: getGroup(groupArr)
	};
};

var generateCameraFields = function(reps){
	var cameras = [];
	var xArr = [
		{
			min: 1,
			max: 2,
			rem: .1*reps
		},
		{
			min: 2,
			max: 3,
			rem: .15*reps
		},
		{
			min: 3,
			max: 4,
			rem: .35*reps
		},
		{
			min: 4,
			max: 4.5,
			rem: .3*reps
		},
		{
			min: 4.5,
			max: 5,
			rem: .1*reps
		}];
	var yArr = [
		{
			min: 150,
			max: 250,
			rem: .15*reps
		},
		{
			min: 250,
			max: 400,
			rem: .25*reps
		},
		{
			min: 400,
			max: 650,
			rem: .35*reps
		},
		{
			min: 650,
			max: 1200,
			rem: .2*reps
		},
		{
			min: 1200,
			max: 1500,
			rem: .05*reps
		}];
	var radArr = [
		{
			min: 1,
			max: 10,
			rem: .2*reps	
		},
		{
			min: 10,
			max: 50,
			rem: .25*reps
		},
		{
			min: 50,
			max: 200,
			rem: .35*reps
		},
		{
			min: 200,
			max: 500,
			rem: .15*reps
		},
		{
			min: 500,
			max: 1000,
			rem: .05*reps
		}];
	var groupArr = [
		{
			brand: 'Olympus',
			rem: .05*reps
		},
		{
			brand: 'Canon',
			rem: .3*reps
		},
		{
			brand: 'Nikon',
			rem: .25*reps
		},
		{
			brand: 'Samsung',
			rem: .15*reps
		},
		{
			brand: 'Sony',
			rem: .15*reps
		},
		{
			brand: 'Kodak',
			rem: .05*reps
		},
		{
			brand: 'Polaroid',
			rem: .05*reps
		}];

	for(var i = 0; i<reps; i++){
		cameras.push(generateCamera(xArr, yArr, radArr, groupArr));
	};

	return cameras;
};

var generateCameras = function(page, reps){
	return {
		page: page,
		jobRunTS: Date.now(),
		fields: JSON.stringify(generateCameraFields(reps))
	};
};

var _user;
var _project;
var _page;
var _job;
var _scraperElementHists;

connectToDb
    .then(function () {
        return wipeCollections();
    })
    .then(function(){
    	return User.findOne({email: 'obama@gmail.com'});
    })
    .then(function(obama) {
    	_user = obama;
    	return Project.create(generateProject(_user));
    })
    .then(function(project){
    	_project = project;
    	return Page.create(generatePage(project.jobs[0]));
    })
    .then(function(page){
    	_page = page;
    	_job = _project.jobs[0];
    	_job.pages = [page];
    	return _project.save();
    })
    .then(function(project){
    	return ScraperElementHist.create(generateCameras(_page, 150))
    })
    .then(function(scraperElementHists){
    	_scraperElementHists = scraperElementHists;
    	console.log(chalk.green('Seed successful!'));
    	process.kill(0);
    })
    .catch(function (err) {
        console.error(err);
        process.kill(1);
    });
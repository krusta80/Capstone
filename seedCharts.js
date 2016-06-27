
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

var generateProject2 = function(user){
	return {
		title: 'Airline Tickets',
		description: 'Understanding the fluctuation of airline ticket prices over 90 days.',
		user: user,
		jobs: [generateJob2(user)]
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

var generateJob2 = function(user){
	return {
		title: 'Airline Tix Job',
		frequency: 1440,
		user: user,
		active: true
	};
};

var generatePages = function(job){
	var brands = ['Olympus','Canon','Nikon','Samsung','Sony','Kodak','Polaroid'];
	
	return brands.map(function(brand) {
		return {
			title: brand,
			job: job,
			url: 'https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords=cameras',
			active: true
		};
	});
};

var generatePages2 = function(job){
	var segments = ['NYC-LAX','NYC-MIA','NYC-LHR'];
	
	return segments.map(function(segment) {
		return {
			title: segment,
			job: job,
			url: 'https://www.kayak.com/flights/'+segment+'/2016-07-12/2016-07-26',
			active: true
		};
	});
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

var generateFlightPrices = function(pages, reps){
	var flightPrices = [];
	var segItineraries = ['NYC-LAX','NYC-MIA','NYC-LHR'];
	var segPrices = [350, 200, 600];
	
	var ts = new Date("March 23, 2016 00:00:00");
	segItineraries.forEach(function(segment){
		var priceCalc = Math.round(segPrices[segItineraries.indexOf(segment)]*100)/100;
		var day90Price = priceCalc;
		flightPrices.push({
			page: pages[segItineraries.indexOf(segment)],
			jobRunTS: ts.getTime(),
			fields: JSON.stringify({
				day: {index: 0, value: ts.toString()},
				price: {index: 1, value: priceCalc.toString()}
			})
		});

		for(var i = 1; i<50; i++){
			var thisDay = new Date(ts.valueOf());
			priceCalc = priceCalc - .15 * day90Price / (90 - 40) + Math.random() * .06 * priceCalc - .03 * priceCalc;
			priceCalc = Math.round(priceCalc*100)/100;
			thisDay.setDate(ts.getDate() + i);
			flightPrices.push({
				page: pages[segItineraries.indexOf(segment)],
				jobRunTS: thisDay.getTime(),
				fields: JSON.stringify({
					day: {index: 0, value: thisDay.toString()},
					price: {index: 1, value: priceCalc.toString()}
				})
			});
		}

		for(var i = 50; i<reps; i++){
			var thisDay = new Date(ts.valueOf());
			priceCalc = priceCalc + .5 * day90Price / 40 + Math.random() * .06 * priceCalc - .03 * priceCalc;
			priceCalc = Math.round(priceCalc*100)/100;
			thisDay.setDate(ts.getDate() + i);
			flightPrices.push({
				page: pages[segItineraries.indexOf(segment)],
				jobRunTS: thisDay.getTime(),
				fields: JSON.stringify({
					day: {index: 0, value: thisDay.toString()},
					price: {index: 1, value: priceCalc.toString()}
				})
			});
		}
	});
	return flightPrices;
}

var generateCamera = function(xArr, yArr, radArr){
	var aveStar = Math.round(getVal(xArr)*10)/10;
	var avePrice = Math.round(getVal(yArr)*100)/100;
	var numReviews = Math.round(getVal(radArr));
	return {
		Average_Star_Rating: {
			index: 0,
			value: aveStar.toString()
		},
		Price: {
			value: avePrice.toString(),
			index: 1
		},
		Number_of_Reviews: {
			value: numReviews.toString(),
			index: 2
		}
	};
};

var generateCameras = function(pages, reps){
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

	var brands = ['Olympus','Canon','Nikon','Samsung','Sony','Kodak','Polaroid'];
	var ts = Date.now();
	for(var i = 0; i<reps; i++){
		cameras.push({
			page: pages[brands.indexOf(getGroup(groupArr))],
			jobRunTS: ts,
			fields: JSON.stringify(generateCamera(xArr, yArr, radArr))
		});
	}

	return cameras;
};

var _user;
var _project; var _project2;
var _pages; var _pages2;
var _job; var _job2;
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
    	return Project.create(generateProject2(_user));
    })
    .then(function(project2) {
    	_project2 = project2;
    	return Page.create(generatePages(project2.jobs[0]));
    })
    .then(function(pages){
    	_pages = pages;
    	_job = _project.jobs[0];
    	_job.pages = pages.map(function(page) {
    		return page._id;
    	});
    	return _project.save();
    })
    .then(function(project){
    	return Page.create(generatePages2(_project2.jobs[0]))
    })
    .then(function(pages) {
    	_pages2 = pages;
    	_job2 = _project2.jobs[0];
    	_job2.pages = pages.map(function(page) {
    		return page._id;
    	});
    	return _project2.save();
    })
    .then(function(project) {
    	return ScraperElementHist.create(generateCameras(_pages, 150))
    })
    .then(function(scraperElementHists){
    	_scraperElementHists = scraperElementHists;
    	return ScraperElementHist.create(generateFlightPrices(_pages2, 90));
    })
    .then(function(scraperElementHists2) {
    	console.log(chalk.green('Seed successful!'));
    	process.kill(0);
    })
    .catch(function (err) {
        console.error(err);
        process.kill(1);
    });
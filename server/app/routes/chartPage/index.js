'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var Chart = mongoose.model('Chart');
var ChartPage = mongoose.model('ChartPage');
module.exports = router;

var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};

//Base url is /dashboard/charts/:id/chartpage/
router.get('/:id', ensureAuthenticated, function(req,res){
	ChartPage.findById(req.params.id)
	.then(function(chartPage){
		res.send(chartPage);
	});
});

router.post('/', ensureAuthenticated, function(req,res){
	req.body.user = req.user;
	ChartPage.create(req.body)
	.then(function(chartPage){
		res.send(chartPage);
	});
});

router.put('/:id', ensureAuthenticated, function(req,res){
	ChartPage.findById(req.params.id)
	.then(function(fetchedChartPage){
		Object.keys(ChartPage.schema.paths).forEach(function(property){
			if(req.body[property] !== undefined){
				fetchedChartPage[property] = req.body[property];
			}
		});
		return fetchedChartPage.save();
	})
	.then(function(chartPage){
		res.send(chartPage);
	});
});

router.delete('/:id', ensureAuthenticated, function(req,res){
	ChartPage.findByIdAndRemove(req.params.id)
	.then(function(chartPage){
		res.send(chartPage);
	});
});
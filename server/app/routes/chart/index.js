'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var Chart = mongoose.model('Chart');
module.exports = router;

var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};

//Base url is /dashboard
router.get('/', ensureAuthenticated, function (req, res){
	Chart.find({user: req.user._id})
	.then(function(charts){
		res.send(charts);
	})
	.catch(function(err){
		console.log("Err:", err);
		res.status(501).send(err);
	})
});

router.get('/charts/:id', ensureAuthenticated, function(req,res){
	Chart.findById(req.params.id)
	.then(function(chart){
		res.send(chart);
	});
});

router.post('/charts', ensureAuthenticated, function(req,res){
	req.body.user = req.user;
	Chart.create(req.body)
	.then(function(chart){
		res.send(chart);
	});
});

router.put('/charts/:id', ensureAuthenticated, function(req,res){
	Chart.findById(req.params.id)
	.then(function(fetchedChart){
		Object.keys(Chart.schema.paths).forEach(function(property){
			if(req.body[property] !== undefined){
				fetchedChart[property] = req.body[property];
			}
		});
		return fetchedChart.save();
	})
	.then(function(chart){
		res.send(chart);
	});
});

router.delete('/charts/:id', ensureAuthenticated, function(req,res){
	Chart.findByIdAndRemove(req.params.id)
	.then(function(chart){
		res.send(chart);
	});
});
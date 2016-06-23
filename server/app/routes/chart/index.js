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
router.get('/new', function(req,res,next){
  var chart = new Chart();
  res.json(chart);
});

//Base url is /charts
router.get('/', ensureAuthenticated, function (req, res){
	Chart.find({user: req.user._id})
	.then(function(charts){
		res.send(charts);
	})
	.catch(function(err){
		console.log("Err:", err);
		res.status(501).send(err);
	});
});

router.get('/:id', ensureAuthenticated, function(req,res){
	Chart.findById(req.params.id)
	.then(function(chart){
		res.send(chart);
	});
});

router.post('/', ensureAuthenticated, function(req,res){
  Chart.findById(req.body._id)
  .then(function(chart){
      if (!chart){
        Chart.create(req.body)
      	.then(function(chart){
      		res.json({msg: 'Saved!'});
      	});
      } else {
        chart.remove()
        .then(function(){
          Chart.create(req.body)
          .then(function(chart){
            res.json({msg: 'Updated at ' + new Date(Date.now()).toLocaleTimeString('en-US')});
          });
        });
      }
  });

});

router.put('/:id', ensureAuthenticated, function(req,res){
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

router.delete('/:id', ensureAuthenticated, function(req,res, next){
	Chart.findByIdAndRemove(req.params.id)
	.then(function(){
		res.sendStatus(200);
	}, next);
});

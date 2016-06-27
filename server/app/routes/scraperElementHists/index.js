var mongoose = require('mongoose'),
  router = require('express').Router(),
  ScraperElementHist = mongoose.model('ScraperElementHist');

router.get('/:pageId', function(req,res,next){
  ScraperElementHist.find({page: req.params.pageId})
  .then(function(data){
    res.json(data);
  }, next);
});

router.get('/byRunId/:id', function(req,res,next){
  ScraperElementHist.find({runId: req.params.id})
  .then(function(data){
    res.json(data);
  }, next);
});

router.get('/', function(req,res,next) {
	ScraperElementHist.find({})
	.then(function(hists) {
		res.json(hists);
	});
});

module.exports = router;

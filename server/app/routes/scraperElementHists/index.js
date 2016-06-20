var mongoose = require('mongoose'),
  router = require('express').Router(),
  ScraperElementHist = mongoose.model('ScraperElementHist');

router.get('/:pageId', function(req,res,next){
  ScraperElementHist.find({page: req.params.pageId})
  .then(function(data){
    res.json(data);
  }, next);
});

module.exports = router;

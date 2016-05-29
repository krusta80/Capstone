var router = require('express').Router(),
  mongoose = require('mongoose');

router.post('/', function(req,res,next){
  mongoose.model('Page').createOrUpdate(req.body)
  .then(function(page){
    res.sendStatus(200);
  }, next);

});

router.get('/new', function(req,res,next){
  var Page = mongoose.model('Page');
  var Grid = mongoose.model('Grid');
  var newPage = new Page();
  var newGrid = new Grid();
  newPage.grid.push(newGrid);
  res.json(newPage);
});
module.exports = router;

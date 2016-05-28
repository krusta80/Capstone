var router = require('express').Router(),
  mongoose = require('mongoose');

router.post('/', function(req,res,next){
  mongoose.model('Page').create(req.body)
  .then(function(page){
    res.sendStatus(200);
  }, next);

});
module.exports = router;

'use strict';
var router = require('express').Router();
module.exports = router;

router.use('/members', require('./members'));
router.use('/apps', require('./apps'));
router.use('/schemas', require('./schemas'));
router.use('/fields', require('./fields'));

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});

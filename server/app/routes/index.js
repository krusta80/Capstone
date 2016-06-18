'use strict';
var router = require('express').Router();
module.exports = router;

router.use('/members', require('./members'));
router.use('/scrape', require('./scrape'));
router.use('/apps', require('./apps'));
router.use('/schemas', require('./schemas'));
router.use('/fields', require('./fields'));
router.use('/scraperelements', require('./scraperElements'));
router.use('/hists', require('./scraperElementHists'));
router.use('/pages', require('./pages'));
router.use('/jobs', require('./jobs'));
router.use('/projects', require('./projects'));
router.use('/charts', require('./chart'));
router.use('/chartpages', require('./chartPage'));

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});

'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var Page = mongoose.model('Page');
var ScraperElement = mongoose.model('ScraperElement');
module.exports = router;

var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};

router.get('/byJob/:jobId', ensureAuthenticated, function (req, res) {
    Page.find({job: req.params.jobId})
    .then(function(pages) {
        res.send(pages);
    });
});

router.get('/:id', ensureAuthenticated, function (req, res) {
    Page.findById(req.params.id)
    .then(function(page) {
        res.send(page);
    });
});

router.post('/', ensureAuthenticated, function (req, res) {
    Page.create(req.body)
    .then(function(page) {
        res.send(page);
    });
});

router.put('/:id', ensureAuthenticated, function (req, res) {
    Page.findById(req.params.id)
    .then(function(page) {
        Object.keys(Page.schema.paths).forEach(function(property) {
            if(req.body[property] !== undefined)
                page[property] = req.body[property];
        })
        return page.save();
    })
    .then(function(page) {
        res.send(page);
    });
});

router.delete('/:id', ensureAuthenticated, function (req, res) {
    Page.findByIdAndRemove(req.params.id)
    .then(function(page) {
        res.send(page);
    });
});

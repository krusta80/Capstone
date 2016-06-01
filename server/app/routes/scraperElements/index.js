'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var ScraperElement = mongoose.model('ScraperElement');
var ScraperElementHist = mongoose.model('ScraperElementHist');
module.exports = router;

var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};

router.get('/:id', ensureAuthenticated, function (req, res) {
    ScraperElement.findById(req.params.id)
    .then(function(scraperElement) {
        res.send(scraperElement);
    });
});

router.post('/', ensureAuthenticated, function (req, res) {
    ScraperElement.create(req.body)
    .then(function(scraperElement) {
        res.send(scraperElement);
    });
});

router.put('/:id', ensureAuthenticated, function (req, res) {
    ScraperElement.findById(req.params.id)
    .then(function(scraperElement) {
        Object.keys(scraperElement).forEach(function(property) {
            if(req.body[property])
                scraperElement[property] = req.body[property];
        })
        return scraperElement.save();
    })
    .then(function(scraperElement) {
        res.send(scraperElement);
    });
});

router.delete('/:id', ensureAuthenticated, function (req, res) {
    ScraperElement.findByIdAndRemove(req.params.id)
    .then(function(scraperElement) {
        res.send(scraperElement);
    });
});
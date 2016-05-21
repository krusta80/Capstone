'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var App = mongoose.model('App');
module.exports = router;


var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};

router.get('/', ensureAuthenticated, function (req, res) {
    App.find({User: req.user})
    .then(function(apps) {
        res.send(apps);
    });
});

router.get('/:appId', ensureAuthenticated, function (req, res) {
    App.findById(req.params.appId)
    .then(function(app) {
        res.send(app);
    });
});

router.post('/', ensureAuthenticated, function (req, res) {
    App.create(req.body)
    .then(function(app) {
        res.send(app);
    });
});

router.put('/:appId', ensureAuthenticated, function (req, res) {
    App.findById(req.params.appId)
    .then(function(app) {
        Object.keys(app).forEach(function(field) {
            if(req.body[field])
                app[field] = req.body[field];
        })
        return app.save();
    })
    .then(function(app) {
        req.send(app);
    });
});

router.delete('/:appId', ensureAuthenticated, function (req, res) {
    App.findByIdAndRemove(req.params.appId)
    .then(function(app) {
        res.send(app);
    });
});
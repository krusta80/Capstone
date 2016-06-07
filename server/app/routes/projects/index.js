'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var Project = mongoose.model('Project');
var Job = mongoose.model('Job');
module.exports = router;

var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};

router.get('/', ensureAuthenticated, function (req, res) {
    Project.find({user: req.user._id})
    .then(function(projects) {
        res.send(projects);
    })
    .catch(function(err) {
        console.log("Err:", err);
        res.status(501).send(err);
    })
});

router.get('/:id', ensureAuthenticated, function (req, res) {
    Project.findById(req.params.id)
    .then(function(project) {
        res.send(project);
    });
});

router.post('/', ensureAuthenticated, function (req, res) {
    req.body.user = req.user;
    Project.create(req.body)
    .then(function(project) {
        res.send(project);
    });
});

router.put('/:id', ensureAuthenticated, function (req, res) {
    Project.findById(req.params.id)
    .then(function(fetchedProject) {
        Object.keys(Project.schema.paths).forEach(function(property) {
            if(req.body[property] !== undefined)
                fetchedProject[property] = req.body[property];
        })
        return fetchedProject.save();
    })
    .then(function(project) {
        res.send(project);
    });
});

router.delete('/:id', ensureAuthenticated, function (req, res) {
    Project.findByIdAndRemove(req.params.id)
    .then(function(project) {
        res.send(project);
    });
});
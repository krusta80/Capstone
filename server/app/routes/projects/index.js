'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var Project = mongoose.model('Project');
var Job = mongoose.model('Job');
module.exports = router;
var UPDATE_FIELDS = ['title', 'jobs'];

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

router.post('/setCurrent/:projectId', ensureAuthenticated, function(req,res,next){
  Project.findById(req.params.projectId)
  .then(function(project){
    if (project)
      req.session.currentProject = project;
    res.sendStatus(200);
  });
});

router.get('/getCurrent', ensureAuthenticated, function(req,res){
  res.json(req.session.currentProject);
});

router.get('/:id', ensureAuthenticated, function (req, res) {
    Project.findById(req.params.id).populate({path: 'jobs.pages'})
    .then(function(project) {
        res.send(project);
    });
});

router.get('/:id/jobs', ensureAuthenticated, function (req, res) {
    Project.findById(req.params.id)
    .then(function(project) {
        res.send(project.jobs);
    });
});

router.post('/', ensureAuthenticated, function (req, res) {
    req.body.user = req.user;
    Project.create(req.body)
    .then(function(project) {
        res.send(project);
    });
});
router.post('/:projectId/job/:jobIndex/run', function(req,res,next){
  Project.findById(req.params.projectId).populate({
    path: 'jobs.pages'
   })
  .then(function(project){
    return project.jobs[req.params.jobIndex].runJob(project);
  })
  .then(function(result){
    res.json(result);
  },next);
});

router.put('/:id', ensureAuthenticated, function (req, res) {
    Project.findById(req.params.id)
    .then(function(fetchedProject) {
        Object.keys(Project.schema.paths).forEach(function(property) {
            if(UPDATE_FIELDS.indexOf(property) > -1){
                fetchedProject[property] = req.body[property];
            }
        });
        return fetchedProject.save();
    })
    .then(function(project) {
        res.json(project);
    });
});

router.delete('/:id', ensureAuthenticated, function (req, res) {
    Project.findByIdAndRemove(req.params.id)
    .then(function(project) {
        res.send(project);
    });
});

'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var Field = mongoose.model('Field');
module.exports = router;

var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};

router.get('/bySchema/:schemaId', ensureAuthenticated, function (req, res) {
    Field.find({Schema: req.params.schemaId})
    .then(function(fields) {
        res.send(fields);
    });
});

router.get('/fieldTypes', ensureAuthenticated, function(req, res) {
    res.send(Field.schema.path('type').enumValues);
});

router.get('/:fieldId', ensureAuthenticated, function (req, res) {
    Field.findById(req.params.fieldId)
    .then(function(field) {
        res.send(field);
    });
});

router.post('/', ensureAuthenticated, function (req, res) {
    Field.create(req.body)
    .then(function(field) {
        res.send(field);
    });
});

router.put('/:fieldId', ensureAuthenticated, function (req, res) {
    Field.findById(req.params.fieldId)
    .then(function(field) {
        Object.keys(field).forEach(function(property) {
            if(req.body[property])
                field[property] = req.body[property];
        })
        return field.save();
    })
    .then(function(field) {
        res.send(field);
    });
});

router.delete('/:fieldId', ensureAuthenticated, function (req, res) {
    Field.findByIdAndRemove(req.params.fieldId)
    .then(function(field) {
        res.send(field);
    });
});
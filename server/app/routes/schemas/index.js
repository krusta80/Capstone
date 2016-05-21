'use strict';
var router = require('express').Router();
var Schema = require('../../../db/models/schema');
module.exports = router;

var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};

router.get('/:appId', ensureAuthenticated, function (req, res) {
    Schema.find({App: req.params.appId})
    .then(function(schemas) {
        res.send(schemas);
    });
});

router.get('/:schemaId', ensureAuthenticated, function (req, res) {
    Schema.findById(req.params.schemaId)
    .then(function(schema) {
        res.send(schema);
    });
});

router.post('/', ensureAuthenticated, function (req, res) {
    Schema.create(req.body)
    .then(function(schema) {
        res.send(schema);
    });
});

router.put('/:schemaId', ensureAuthenticated, function (req, res) {
    Schema.findById(req.params.schemaId)
    .then(function(schema) {
        Object.keys(schema).forEach(function(field) {
            if(req.body[field])
                schema[field] = req.body[field];
        })
        return schema.save();
    })
    .then(function(schema) {
        req.send(schema);
    });
});

router.delete('/:schemaId', ensureAuthenticated, function (req, res) {
    Schema.findByIdAndRemove(req.params.schemaId)
    .then(function(schema) {
        res.send(schema);
    });
});
/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('./server/db');
var User = mongoose.model('User'),
  pageData = require('./tests/server/seeds/testPage'),
  makeHist = require('./tests/server/seeds/chartSeed'),
  makeProj = require('./tests/server/seeds/jobSeed');
  Page = mongoose.model('Page'),
  Job = mongoose.model('Job'),
  Project = mongoose.model('Project'),
  ScraperElementHist = mongoose.model('ScraperElementHist');

var wipeCollections = function () {
    var removeUsers = User.remove({});
    return Promise.all([
        removeUsers, Page.remove({}), Project.remove({}), ScraperElementHist.remove({})
    ]);
};

var seedUsers = function () {

    var user =
        {
            email: 'obama@gmail.com',
            password: 'potus'
        };


    return User.create(user);

};

var seedPages = function(){
  return Page.create(pageData);
};

var seedHist = function(pages){
  return Promise.map(pages, function(page){
    return ScraperElementHist.create(makeHist(page._id, 10));

  });
};

var seedProject = function(pageId, userId){
  return Project.create(makeProj(pageId, userId));
};

connectToDb
    .then(function () {
        return wipeCollections();
    })
    .then(seedPages)
    .then(function (pages) {
        seedUsers()
        .then(function(user){
          return Promise.join(seedHist(pages), seedProject(pages, user._id));
        })
        .then(function(resolved){
          var jobId = resolved[1].jobs[0]._id;
          return Promise.map(pages, function(page){
            page.job = jobId;
            return page.save();
          });
        })
        .then(function () {
            console.log(chalk.green('Seed successful!'));
            process.kill(0);
        })
        .catch(function (err) {
            console.error(err);
            process.kill(1);
        });
      });

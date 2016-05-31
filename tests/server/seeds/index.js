var mongoose = require('mongoose'),
  pageData = require('./page');
require('../../../server/db/models');
var Page = mongoose.model('Page'),
  ScraperElement = mongoose.model('ScraperElement'),
  conn;

function connect(){
  if (!conn){
    conn = mongoose.connect('mongodb://localhost/capstone-dev', function(err){
      if (err)
        console.log(err);
    });

  }
  return conn;
}

function seed(){
    connect()
    .then(function(){
      return conn.connection.db.dropDatabase();
    })
    .then(function(){
      return Page.create(pageData);
    })
    .catch(function(err){
      console.log(err);
    });
}

module.exports = seed;

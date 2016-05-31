var Scraper = require('../../../server/app/utils/scraperBasic'),
  seed = require('../seeds'),
  expect = require('chai').expect,
  mongoose = require('mongoose'),
  Page = mongoose.model('Page'),
  ScraperElementHist = mongoose.model('ScraperElementHist');

  xdescribe('basic functionality', function(){
    this.timeout(30000);
    var page;
    before(function(){
      return seed();
    });
    it('verify seed', function(){
      return Page.find()
      .then(function(pages){
          expect(pages.length).to.equal(1);
          page = pages[0];
      });
    });
    it('performs basic scraping operation', function(done){
      var scraper = new Scraper(page);
      scraper.go(30000)
      .then(function(){
        return ScraperElementHist.find();
      })
      .then(function(elements){
        expect(elements.length).to.equal(2);
        done();
      })
      .catch(function(err){
        console.log(err);
        done();
      });
    });
  });

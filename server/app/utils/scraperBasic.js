var Horseman = require('node-horseman'),
  Promise = require('bluebird'),
  mongoose = require('mongoose');


function Scraper(page){
    this.url = page.url;
    this.page = page;
    this.horseman = new Horseman();
      //may need to add path to phantomjs
}

function evaluate(horseman, scraperElement){
  return horseman.evaluate(function(element){
    var fields = JSON.parse(element.fields);
    var fieldHist = Object.keys(fields).reduce(function(acc, fieldName){
      var fieldVal = fields[fieldName];
      var elem = $(element.domSelector)[element.selectorIndex];
      var elemVal;
      var targetElem = $(elem).find(fieldVal.type + ':first');
      if (fieldVal.attr === 'text')
        elemVal = targetElem.text();
      else
        elemVal = targetElem.attr(fieldVal.attr);
      acc[fieldName] = {index: fieldName[field].index, value: elemValue};
      return acc;
    }, {});
    return fieldHist;
    }, scraperElement);
}

function execute(horseman, page){
  return Promise.map(page.targetElements, function(scraperElement){
    console.log(scraperElement);
    return evaluate(horseman, scraperElement)
    .then(function(fieldHist){
      mongoose.model('ScraperElementHist').create({
        scraperElement: scraperElement._id,
        fields: JSON.stringify(fieldHist)
        //TO DO: Populate additional fields
      });
    });
  })
  .catch(function(err){
    console.log(err);
  });

}

Scraper.prototype.go = function(timeout, actions){
  var page = this.page;
  var horseman = this.horseman;
  actions = actions || [];
  actions.unshift({fn: 'open', params: [this.url]});
  actions.unshift({fn: 'userAgent', params: ["Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0"]});
  if (actions.length > 2)
    actions.push({fn: 'keyboardEvent', params:['keypress', 16777221]});
  actions.forEach(function(action){
    horseman = horseman[action.fn].apply(horseman, action.params);
  });
  return horseman.wait(timeout || 2000)
  .then(function(){
      return execute(horseman, page);
  })
  .then(function(){
    horseman.close();
  })
  .catch(function(err){
    console.log(err);
  });
};

module.exports = Scraper;

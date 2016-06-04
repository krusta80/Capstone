var Horseman = require('node-horseman'),
  Promise = require('bluebird'),
  mongoose = require('mongoose');


function Scraper(page){
    this.url = page.url;
    this.page = page;
    this.horseman = new Horseman();
      //may need to add path to phantomjs
}

function evaluate(horseman, targetElements){
  return horseman.evaluate(function(elements){
    return elements.reduce(function(acc, element){
      var fields = JSON.parse(element.fields);
      var fieldHist = Object.keys(fields).reduce(function(acc, fieldName){
        var fieldVal = fields[fieldName];
        var elem = document.querySelectorAll(element.domSelector);
        if (!elem.length) return acc;
        var elemVal;
        var targetElem = elem[element.selectorIndex].getElementsByTagName(fieldVal.type)[fieldVal.index];
        if (fieldVal.attr === 'text')
          elemVal = targetElem.innerText;
        else
          elemVal = targetElem.getAttribute(fieldVal.attr);
        acc[fieldName] = {index: fieldVal.index, value: elemVal};
        return acc;
      }, {});
      acc.push({
        scraperElement: element._id,
        fields: JSON.stringify(fieldHist)
      });
      return acc;
    },[]);
  }, targetElements);
}

function execute(horseman, page, results){
  return evaluate(horseman, page.targetElements)
  .then(function(fieldHists){
    var nSucceeded = fieldHists.filter(i=>i.fields !== JSON.stringify({}));
    results.pages[page._id] = {numElements: page.targetElements.length, numSuccess: nSucceeded.length  };
      return mongoose.model('ScraperElementHist').insertMany(fieldHists);
        //TO DO: Populate additional fields
  });
}

Scraper.prototype.go = function(timeout,results){
  var page = this.page;
  var horseman = this.horseman;
  var actions = page.actions ? JSON.parse(page.actions) : [];
  actions.unshift({fn: 'open', params: [this.url]});
  actions.unshift({fn: 'userAgent', params: ["Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0"]});
  // if (actions.length > 2)
  //   actions.push({fn: 'keyboardEvent', params:['keypress', 16777221]});
  actions.forEach(function(action){
    horseman = horseman[action.fn].apply(horseman, action.params);
  });
  return horseman.wait(timeout || 2000)
  .then(function(){
      return execute(horseman, page, results);
  })
  .then(function(){
    horseman.close();
  })
  .catch(function(err){
    console.log(err);
  });
};

module.exports = Scraper;

var Horseman = require('node-horseman');


function Scraper(url, selector){
    this.url = url;
    this.selector = selector;
    this.horseman = new Horseman();
      //may need to add path to phantomjs
}

function evaluate(horseman, selector){
  return horseman.evaluate(function(sel){
    var elems = ['a', 'span', 'img', 'h3']; //elems to include in the data row
    var data = [];
    $(sel).each(function( item ){
      var row ={};
      elems.forEach(function(elem, i){
        var attr = $(this).find(elem)[0];
        if (elem === 'img')
          row[elem] = $(attr).attr('src');
        else{
          var text = $(attr).text();
          if (text) row[elem] = text;
          if (elem === 'a')
            row.href = $(attr).attr('href');
        }
      },this);
      data.push(row);
    });
      return data;
    }, selector);
}

function execute(horseman, selector, pages, data){
  data = data || [];
  return new Promise(function(resolve,reject){
    return evaluate(horseman, selector)
    .then(function(newData){
      data = data.concat(newData);
      if (pages && pages.num > 0){
        pages.num = pages.num -1;
        return horseman
          .click(pages.selector)
          .wait(1000)
          .then( function(){
            return execute(horseman, selector, pages, data );
          });
      }
      return data;
    })
    .then(function(data){
      return resolve(data);
    })
    .catch(function(err){
      return reject(err);
    })
    .finally(function(){
      horseman.close();
    });

  });
}

Scraper.prototype.go = function(timeout, actions, pages){
  var selector = this.selector;
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
    return execute(horseman, selector, pages);
  });
};

module.exports = Scraper;

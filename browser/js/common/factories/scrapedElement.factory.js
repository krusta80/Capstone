app.factory('ScraperElementFactory', function($http, PageFactory){
  var scrapedFieldObj = {};
  var cachedData;
  scrapedFieldObj.save = function() {

  };

  scrapedFieldObj.reset = function() {
    cachedData['data'] = [];
    cachedData['maxAdditionalFields'] = 0;
  };

  scrapedFieldObj.remove = function(dataObj) {
    var index = cachedData.data.indexOf(dataObj);
    cachedData.data.splice(index,1);
  };

  scrapedFieldObj.update = function(pageObj) {
    cachedData = pageObj;
  };

  scrapedFieldObj.setAndGet = function(pageObj) {
    cachedData = pageObj;
    return cachedData;
  };

  return scrapedFieldObj;
});

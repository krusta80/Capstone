app.factory('ScraperElementFactory', function($http, PageFactory){
  var scrapedFieldObj = {};
  var cachedData = {
    data: [],
    maxAdditionalFields: 0
  };
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

  scrapedFieldObj.add = function(dataObj) {
    if (dataObj.content === "Too many elements - narrow your search") { return; }
    if (dataObj.additionalTargets) {
      if (cachedData.maxAdditionalFields < dataObj.additionalTargets.length) {
        cachedData.maxAdditionalFields = dataObj.additionalTargets.length;
      }    
    }
    cachedData['data'].push(dataObj);
  };

  scrapedFieldObj.get = function() {
    return cachedData;
  };

  return scrapedFieldObj;
});

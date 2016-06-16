app.factory('ScraperElementFactory', function($http, PageFactory){
  var scrapedFieldObj = {};
  var cachedData;
  var payload;
  scrapedFieldObj.save = function() {
    debugger;
    payload = _.cloneDeep(cachedData);
    payload.targetElements.forEach(function(targetElement, idx) {
      console.log(payload.targetElements[idx].fields);
      payload.targetElements[idx].fields = JSON.stringify(targetElement.fields);
    });
    return $http.put('/api/pages/' + payload._id, payload).then(function(response) {
      response.data.targetElements.forEach(function(targetElement) {
        targetElement.fields = JSON.parse(targetElement.fields);
      });
      cachedData = response.data;
      return cachedData;
    });
  };

  scrapedFieldObj.reset = function() {
    cachedData.targetElements = [];
    this.save();
  };

  scrapedFieldObj.remove = function(target, key) {
    var currIndex = _.findIndex(cachedData.targetElements,{'_id': target._id});
    var currTarget = cachedData.targetElements[currIndex];
    if (Object.keys(currTarget.fields).length == 1) {
      cachedData.targetElements.splice(currIndex,1)
    } else {
      delete currTarget.fields[key];
    }
    this.save()
  };

  scrapedFieldObj.update = function(pageObj) {
    debugger;
    pageObj.targetElements.forEach(function(targetElement) {
      if (typeof targetElement.fields === "string") {
          targetElement.fields = JSON.parse(targetElement.fields);
      }
    });
    cachedData = pageObj;
  };

  scrapedFieldObj.setAndGet = function(pageObj) {
    cachedData = pageObj;
    return cachedData;
  };

  return scrapedFieldObj;
});

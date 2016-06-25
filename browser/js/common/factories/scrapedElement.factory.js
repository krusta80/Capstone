app.factory('ScraperElementFactory', function($http, Messenger, $rootScope){
  var scrapedFieldObj = {};
  var cached;
  var payload;
  scrapedFieldObj.save = function() {
    payload = _.cloneDeep(cached);
    payload.targetElements.forEach(function(targetElement, idx) {
      payload.targetElements[idx].fields = JSON.stringify(targetElement.fields);
    });
    return $http.put('/api/pages/' + payload._id, payload).then(function(response) {
      response.data.targetElements.forEach(function(targetElement) {
        targetElement.fields = JSON.parse(targetElement.fields);
      });
      cached = response.data;
      $rootScope.$emit('pageUpdated', cached);
      Messenger.fromScraperElementFactory(cached);
      return cached;
    });
  };

  scrapedFieldObj.reset = function() {
    cached.targetElements = [];
    var iframe = document.getElementById('iframedisplay').contentDocument;
    iframe.querySelectorAll('.__chosenElement__').forEach(function(elem) {
      elem.remove();
    });
    this.save();
  };

  scrapedFieldObj.remove = function(target, key) {
    let currIndex = _.findIndex(cached.targetElements,{'_id': target._id});
    let currTarget = cached.targetElements[currIndex];
    if (Object.keys(currTarget.fields).length == 1) {
      cached.targetElements.splice(currIndex,1)
    } else {
      delete currTarget.fields[key];
    }
    this.save()
  };

  scrapedFieldObj.update = function(pageObj) {
    pageObj.targetElements = pageObj.targetElements.map(function(targetElement) {
        if (typeof targetElement.fields === "string") {
            targetElement.fields = JSON.parse(targetElement.fields);
        }
        return targetElement;
    });
    cached = pageObj;
    Messenger.fromScraperElementFactory(cached);
    return cached;
  };

  scrapedFieldObj.setAndGet = function(pageObj) {
    cached = pageObj;
    Messenger.fromScraperElementFactory(cached);
    return cached;
  };
  scrapedFieldObj.get = function() {
    return cached;
  }

  return scrapedFieldObj;
});

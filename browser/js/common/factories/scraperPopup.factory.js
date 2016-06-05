app.factory('ScraperPopupFactory', function($http){
  var scrapedFieldObj = {};
  var cachedData = {
    data: [],
    toBeSaved: []
  };
  scrapedFieldObj.save = function() {

  };

  scrapedFieldObj.saveToRow = function(index) {
    // defaults to content
    index = index || _.findIndex(cachedData.data,'key','content');
    cachedData.toBeSaved.push(index);
  };

  scrapedFieldObj.reset = function() {
    cachedData['data'] = [];
    cachedData['toBeSaved'] = [];
  };

  scrapedFieldObj.remove = function(dataObj) {
    var index = cachedData.data.indexOf(dataObj);
    cachedData.data.splice(index,1);
  };

  scrapedFieldObj.addRow = function() {
    var clone = cachedData.data[0].slice(0);
    cachedData.data.push(clone);
  };

  scrapedFieldObj.add = function(dataArr) {
    var contentObj = _.filter(dataArr, 'key', 'content');
    if (contentObj.value === "Too many elements - narrow your search") { return; }
    cachedData['data'] = scrapedFieldObj.transform(dataArr);
    console.log('heres the transformed data', cachedData);
    return cachedData;
  };

  scrapedFieldObj.get = function() {
    return cachedData;
  };

  // utility methods
  scrapedFieldObj.transform = function(arrayOfObj) {
    var obj;
    var array = [];
    for (var i = 0; i < arrayOfObj.length; i++) {
      obj = {};
      obj['key'] = Object.keys(arrayOfObj[i])[0];
      obj['value'] = arrayOfObj[i][obj['key']];
      array.push(obj);
    }
    return array;
  }

  scrapedFieldObj.getContent = function(arrayOfObj) {
    for (var i = 0; i < arrayOfObj.length; i++) {
      if (arrayOfObj[i].content) {
        return {content: arrayOfObj[i].content};
      }
      if (arrayOfObj[i].key === "content") {
        return arrayOfObj[i];
      }
    }
  }

  return scrapedFieldObj;
});
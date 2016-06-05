app.factory('ScraperPopupFactory', function($http, Messenger){
  var scrapedFieldObj = {};
  var cachedData = {
    data: [],
    raw: null
  };
  scrapedFieldObj.save = function(savedAttributes, cache) {
    var fieldsObj = {};
    savedAttributes.forEach(function(attribute) {
      
      fieldsObj[attribute.key] = {
        attr: attribute.key
      };
      var obj;
      if (attribute.key.includes('target')) {
        fieldsObj[attribute.key]['index'] = attribute.key[attribute.key.length-1] - 1;
        fieldsObj[attribute.key]['type'] = 'subelement';
        console.log('fields obj made!', fieldsObj);
      }
    });

    var scraperElementSchema = {
      name: 'test',
      domSelector: cachedData.raw.selector,
      fields: JSON.stringify(fieldsObj)
    };
    console.log('final schema: ', scraperElementSchema);


    return $http.post('/api/scraperelements', scraperElementSchema);
  };

  scrapedFieldObj.reset = function() {
    cachedData['data'] = [];
    cachedData['raw'] = null;
  };

  scrapedFieldObj.remove = function(dataObj) {
    var index = cachedData.data.indexOf(dataObj);
    cachedData.data.splice(index,1);
  };

  scrapedFieldObj.addRow = function() {
    var clone = cachedData.data[0].slice(0);
    cachedData.data.push(clone);
  };

  scrapedFieldObj.add = function(rawData) {
    var contentObj = _.filter(rawData.elements, 'key', 'content');
    if (contentObj.value === "Too many elements - narrow your search") { return; }
    cachedData['raw'] = rawData;
    cachedData['data'] = scrapedFieldObj.transform(rawData.elements);
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
      if(Object.keys(arrayOfObj[i])[0] === 'content') {
        obj['selected'] = true;
      } else {
        obj['selected'] = false;  
      }
      
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
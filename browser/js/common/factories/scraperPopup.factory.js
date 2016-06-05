app.factory('ScraperPopupFactory', function($http, Messenger){
  var scrapedFieldObj = {};
  var cachedData = {
    data: [],
    raw: null
  };
  scrapedFieldObj.save = function(savedAttributes, cache) {
    var fieldsObj = {};
    savedAttributes.forEach(function(attribute) {
      var obj = {
        attr: attribute['attr'],
        index: attribute['index']
      };
      if (attribute.attr === 'content') {
        fieldsObj[attribute.attr] = obj;
      } else {
        fieldsObj[attribute.name] = obj;  
      }
    });

    var scraperElementSchema = {
      name: 'test',
      domSelector: cachedData.raw.selector,
      fields: JSON.stringify(fieldsObj)
    };
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
    // var contentObj = rawData.elements[rawData.elements.length-1]
    var contentObj = _.filter(rawData.elements, 'attr', 'content');
    if (contentObj === "Too many elements - narrow your search") { return; }
    cachedData['raw'] = rawData;
    cachedData['data'] = scrapedFieldObj.transform(rawData.elements);
    return cachedData;
  };

  scrapedFieldObj.get = function() {
    return cachedData;
  };

  // utility methods
  scrapedFieldObj.transform = function(arrayOfObj) {
    for (var i = 0; i < arrayOfObj.length; i++) {
      if(arrayOfObj[i].attr === 'content') {
        arrayOfObj[i]['selected'] = true;
      } else {
        arrayOfObj[i]['selected'] = false;
      }
    }
    return arrayOfObj;
  }

  scrapedFieldObj.getContent = function(arrayOfObj) {
    return arrayOfObj[arrayOfObj.length-1];
  }

  return scrapedFieldObj;
});
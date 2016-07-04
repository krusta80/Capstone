app.factory('ScraperPopupFactory', function($rootScope, $http, Messenger, PageFactory, ScraperElementFactory){
  var scrapedFieldObj = {};
  var pageObj;
  var cachedData = {
    data: [],
    raw: null
  };
  scrapedFieldObj.setPage = function(page) {
    pageObj = page;
  };
  scrapedFieldObj.getPage = function(){
    return pageObj;
  };
  scrapedFieldObj.save = function(savedAttributes, cache, isRepeating) {
     pageObj = ScraperElementFactory.get();
    if (!isRepeating){
      var fieldsObj = {};
      savedAttributes.forEach(function(attribute) {
        var obj = {
          attr: attribute['attr'],
          index: attribute['index'],
          tempVal: attribute['value']
        };
        if (attribute.attr === 'content') {
          fieldsObj[attribute.attr] = obj;
        } else {
          fieldsObj[attribute.name] = obj;
        }
      });
      var scraperElementSchema = {
        name: 'target ' + (pageObj.targetElements.length + 1).toString(),
        domSelector: cachedData.raw.selector,
        selectorIndex: cachedData.raw.selectorIndex,
        fields: JSON.stringify(fieldsObj)
      };
      pageObj.targetElements.push(scraperElementSchema);
    }
    else{
      cachedData.raw.repeats.forEach(function(elem){
        var scraperElementSchema = {
          name: 'Repeating Elements',
          domSelector: elem.selector,
          selectorIndex: elem.selectorIndex,
          fields: JSON.stringify({
              field0:{
                attr: 'content',
                index: -1
            }
          })
        };
        pageObj.targetElements.push(scraperElementSchema);
      });
    }
    $rootScope.$emit('extract',pageObj);
    var payload = _.cloneDeep(pageObj);
    payload.targetElements.forEach(function(targetElement) {
      targetElement.fields = JSON.stringify(targetElement.fields);
    });
    return PageFactory.update(payload).then(function(data) {
      $rootScope.$emit('extract',data); // need to do it twice to update the data... couldnt find a refactor that worked
      return data;
    });
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

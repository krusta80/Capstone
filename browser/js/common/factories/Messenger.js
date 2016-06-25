app.factory('Messenger', function($rootScope){
  var hoverValue, clickValue, repeating = false,
  scrapedFieldObj, isAnnotate, currentUrl = "";
  return {
    hover: function(val){
      hoverValue = val;
      $rootScope.$broadcast('hover', hoverValue);
    },
    click: function(val, coordinates) {
      clickValue = val;
      $rootScope.$broadcast('click',clickValue,coordinates);
    },
    get: function(){
      if (clickValue)
        console.log("clickValue", clickValue);
        return clickValue;
      return;
    },
    isAnnotate: function() {
      return isAnnotate;
    },
    setAnnotate: function(action) {
      if (typeof action != "boolean") {
        console.error('was not a boolean');
        return false;
      }
      console.log('annotation was set to : ', action);
      isAnnotate = action;
      return true;
    },
    fromScraperElementFactory: function(data) {
      scrapedFieldObj = data;
    },
    setUrl: function(url) {
      currentUrl = url;
      $rootScope.$broadcast('urlChanged', url);
    },
    getScraperFieldObj: function() {
      return scrapedFieldObj;
    }
  };
});

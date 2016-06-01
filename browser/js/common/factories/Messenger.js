app.factory('Messenger', function($rootScope){
  var hoverValue, clickValue, repeating = false;
  return {
    hover: function(val){
      hoverValue = val;
      $rootScope.$broadcast('hover', hoverValue);
    },
    click: function(val) {
      clickValue = val;
      $rootScope.$broadcast('extract',clickValue);
    },
    get: function(){
      if (clickValue)
        return clickValue;
      return;
    }
  };
});

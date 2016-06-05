app.factory('Messenger', function($rootScope){
  var hoverValue, clickValue, repeating = false;
  return {
    hover: function(val){
      hoverValue = val;
      $rootScope.$broadcast('hover', hoverValue);
    },
    click: function(val, coordinates) {
      clickValue = val;
      console.log('here is the click ');
      $rootScope.$broadcast('click',clickValue,coordinates);
    },
    get: function(){
      if (clickValue)
        return clickValue;
      return;
    }
  };
});

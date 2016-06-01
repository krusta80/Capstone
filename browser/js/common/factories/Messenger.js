app.factory('Messenger', function($rootScope){
  var msg, repeating = false;
  return {
    set: function(val){
      msg = val;
      $rootScope.$broadcast('extract', msg);
    },
    get: function(){
      if (msg)
        return msg;
      return;
    }
  };
});

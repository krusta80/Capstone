app.factory('Messenger', function($rootScope){
  var msg;
  return {
    set: function(val){
      msg = val;
    },
    get: function(){
      if (msg)
        return msg;
      return;
    }
  };
});

app.factory('Messenger', function($rootScope){
  var msg, repeating = false;
  return {
    set: function(val){
      msg = val;
    },
    get: function(){
      if (msg)
        return msg;
      return;
    },
    isMultiple: function(){
      return repeating;
    },
    setMultiple: function(){
      repeating = !repeating;
    }
  };
});

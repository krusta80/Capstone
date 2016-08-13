app.factory("UserFactory", function($http){
  return {
    checkEmail: function(email){
      return $http.get('/api/members/check/' + email)
      .then(function(res){
        return res.data;
      });
    },
    addUser: function(data){
      return $http.post('/api/members', data)
      .then(function(res){
        return res.data;
      });
    }
  };
});

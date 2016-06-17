'use strict';

app.factory('DashboardFactory', function($http) {
  var DashboardFactory = {};

  DashboardFactory.getCharts = function(){
    return $http.get('/api/charts')
    .then(function(response){
      return response.data;
    });
  };

  return DashboardFactory;

});

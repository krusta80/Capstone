'use strict';

app.factory('ChartSetupFactory', function($http) {
  var ChartSetupFactory = {};

  ChartSetupFactory.getProjects = function(){
    //hit users for their projects
    return $http.get('/api/projects')
    .then(function(response){
      return response.data;
    });
  };

  ChartSetupFactory.getJobs = function (project){
    //hit project and return jobs within
    return $http.get('/api/projects/' + project._id + '/jobs')
    .then(function(response){
      return response.data;
    });
  };

  ChartSetupFactory.getPages = function (job){
    //hit job and return pages within
    return $http.get('/api/pages/byJob/' + job._id)
    .then(function(response){
      return response.data;
    });
  };

  ChartSetupFactory.saveChart = function (data){
    //saves $scope.data
    return $http.post('/api/charts', data)
    .then(function(response){
      console.log('response is',response)
      return response.data;
    })
    .catch(function(err){
      console.log("Err:", err);
    });
  };

  return ChartSetupFactory;

});

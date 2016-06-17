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
    return $http.get('/api/jobs/byProject/' + project._id)
    .then(function(response){
      console.log('/api/jobs/byProject/' + project._id)
      console.log('project._id is',project._id)
      console.log('response.data is',response.data)
      return response.data;
    });
  };

  ChartSetupFactory.getPages = function (job){
    //hit job and return pages within
    return $http.get('/api/jobs/byJob/' + job.id)
    .then(function(response){
      return response.data;
    });
  };

  ChartSetupFactory.saveData = function (data){
    //saves $scope.data
    return $http.post('/api/charts')
    .then(function(response){
      return response.data;
    });
  };

  return ChartSetupFactory;

});

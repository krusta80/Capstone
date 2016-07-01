app.config(function($stateProvider){
  $stateProvider
    .state('control',{
      url: '/control',
      template: '<control-sidebar></control-sidebar><ui-view></ui-view>',
      abstract: true
    })
    .state('control.projects', {
      url: '/projects',
      templateUrl: 'js/control/control.projects.html',
      resolve: {
        projects: function(ControlFactory){
          return ControlFactory.fetchAllProjects();
        },
        currentProject: function(ControlFactory){
          return ControlFactory.fetchCurrentProject();
        },
        currentJob: function(ControlFactory){
          return ControlFactory.fetchCurrentJob();
        }
      },
      controller: function(projects,$stateParams, $scope, ControlFactory, $timeout){
        //ControlFactory.setProjects(projects);
        $scope.getCurrentJob = ControlFactory.getCurrentJob;
        $scope.saveProject = function(){
          ControlFactory.saveProject();
        };
        $scope.showCustom = function(){
          return [15,60,1440].indexOf(ControlFactory.getCurrentJob().frequency) === -1;
        };
      }
    });
});

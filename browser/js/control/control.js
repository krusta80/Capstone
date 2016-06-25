app.config(function($stateProvider){
  $stateProvider
    .state('control', {
      url: '/controls?project&job&page',
      templateUrl: 'js/control/control.html',
      resolve: {
        projects: function(ProjectFactory){
          return ProjectFactory.fetchAll();
        }
      },
      controller: function(projects, $stateParams, $scope, ControlFactory){
        ControlFactory.setProjects(projects);
        $scope.getCurrentJob = ControlFactory.getCurrentJob;
      }
    });
});

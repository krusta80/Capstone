app.config(function($stateProvider){
  $stateProvider
    .state('projects.project.jobChartDesigner', {
      url: '/job/:id/designer',
      templateUrl: 'js/chart-designer/chart-designer.html',
      resolve: {
        project: function(ProjectFactory, $stateParams){
          return ProjectFactory.fetchById($stateParams.projectId);
        }
      },
      controller: function(project, JobFactory, $stateParams, $scope){
        $scope.job = project.jobs[JobFactory.findJobIndex(project.jobs, $stateParams.id)];
        console.log($scope.job);
      }
    });
});

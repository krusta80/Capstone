app.config(function($stateProvider){
  $stateProvider
    .state('projects.project.jobChartDesigner', {
      url: '/job/:id/designer',
      template: '<p>hello</p>',
      resolve: {
        project: function(ProjectFactory, $stateParams){
          return ProjectFactory.fetchById($stateParams.projectId);
        }
      },
      controller: function(project, $scope){
        console.log(project);
      }
    });
});

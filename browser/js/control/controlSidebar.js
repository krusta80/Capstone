app.directive('controlSidebar', function(){
  return {
    restrict: 'E',
    templateUrl: 'js/control/control-sidebar.html',
    controller: function($scope, $rootScope, ControlFactory, PageFactory){
      $rootScope.$on('goToProject', function(evt,project){
        $scope.selectedProject = project;
      });
      $scope.selectedProject = ControlFactory.getCurrentProject();
      $scope.getProjects = ControlFactory.getProjects;
      $scope.getPages = ControlFactory.getPages;
      $scope.getCurrentJob = ControlFactory.getCurrentJob;
      $scope.getCurrentPage = ControlFactory.getCurrentPage;
      $scope.setCurrentPage = ControlFactory.setCurrentPage;


      $scope.callRefresh = function(type){
        $rootScope.emit('refresh', {type: type});
      };
      $scope.loadProject = function(){
        if ($scope.selectedProject){
          ControlFactory.setCurrentProject($scope.selectedProject);
        }
      };
      $scope.getCurrentProject = ControlFactory.getCurrentProject;
      $scope.loadJob = function(selectedJob){
        ControlFactory.setCurrentJob(selectedJob)
        .then(function(){
          return PageFactory.fetchByJobId(selectedJob._id);
          })
          .then(function(pages){
            ControlFactory.setPages(pages);
        });
      };
      $scope.addPage = function(){
        ControlFactory.addPage();
      };
    }
  };
});

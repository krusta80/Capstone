app.directive('sideBar', function(){
  return {
    restrict: 'E',
    templateUrl: '/js/projects/sidebar.html',
    controller: function($scope, $rootScope, ProjectFactory){
      $scope.hasProject = function() {
      	return $scope.selectedProject;
      };
      $scope.hasProjectAndJob = function() {
  //     	console.log("selected project:", $scope.selectedProject);
		
  //     	console.log("project:", $scope.project);
		// console.log("job:", $scope.job);
      	return $scope.selectedProject && $scope.pages;
      };
      
      $scope.sideBarProjects = ProjectFactory.getCacheProjects();
     // console.log('$scope', $scope.sideBarProjects);
    }
  };
});

app.directive('sideBar', function(){
  return {
    restrict: 'E',
    templateUrl: '/js/projects/sidebar.html',
    controller: function($scope, $rootScope, ProjectFactory){
      $scope.sideBarProjects = ProjectFactory.getCacheProjects();
      console.log('$scope', $scope.sideBarProjects);
    }
  };
});

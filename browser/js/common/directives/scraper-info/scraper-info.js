app.directive('scraperInfo', function(){
  return {
    templateUrl: '/js/common/directives/scraper-info/scraper-info.html',
    controller: function($scope, $rootScope, Messenger){
      $scope.activated = true;
      $rootScope.$on('hover', function(evt, data){
        $scope.data = data;
        $scope.content = _.find(data.elements, 'attr','content');
        $scope.scraperSelector = data.selector;
        $scope.scraperElements = data.elements.slice(0,data.elements.length-1);
        $scope.$apply();
      });

    }
  };
});


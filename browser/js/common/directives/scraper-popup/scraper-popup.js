app.directive('scraperPopup', function(){
  return {
    templateUrl: '/js/common/directives/scraper-popup/scraper-popup.html',
    controller: function($scope, $rootScope, Messenger){
      $scope.activated = true;
      $rootScope.$on('hover', function(evt, data){
        $scope.data = data;
        $scope.$apply();
      });

    }
  };
});


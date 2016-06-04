app.directive('scraperPopup', function(){
  return {
    templateUrl: '/js/common/directives/scraper-popup/scraper-popup.html',
    controller: function($scope, $rootScope, Messenger){
      $scope.activated = true;
      $rootScope.$on('hover', function(evt, data){
        var contentIdx = data.elements.findIndex(function(element) {
          return Object.keys(element)[0] === "content";
        });
        $scope.content = data.elements.splice(contentIdx, 1)[0];
        $scope.data = data;
        $scope.$apply();
      });

    }
  };
});


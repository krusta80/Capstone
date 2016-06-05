app.directive('scraperPopup', function($rootScope, ScraperPopupFactory){
  return {
    restric: 'E',
    templateUrl: '/js/common/directives/scraper-popup/scraper-popup.html',
    transclude: true,
    link: function(scope) {
      scope.popupactivated = false;

      scope.addRow = function(obj) {
        ScraperPopupFactory.addRow();
      };

      scope.getContent = function(arrayOfObj) {
        console.log('getcontent', arrayOfObj);
        return getContent(arrayOfObj);
      };

      scope.saveData = function(selectedAttribute) {
        
      };

      scope.removePopupItem = function() {
        
      };

      $rootScope.$on('click', function(evt, data, coordinates){
        scope.popupactivated = true;
        scope.left = coordinates.x;
        scope.top = coordinates.y;
        ScraperPopupFactory.reset();
        scope.popupData = ScraperPopupFactory.add(data.elements).data;
        ScraperPopupFactory.saveToRow(); // default

        scope.currentContent = ScraperPopupFactory.getContent(scope.popupData);
        scope.selectedAttribute = scope.currentContent.value;
        scope.$apply();
      });

    }
  };
});






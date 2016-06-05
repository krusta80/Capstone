app.directive('scraperPopup', function($rootScope, ScraperPopupFactory){
  return {
    restric: 'E',
    templateUrl: '/js/common/directives/scraper-popup/scraper-popup.html',
    scope: {},
    transclude: true,
    link: function(scope) {
      scope.popupactivated = false;

      scope.addRow = function(obj) {
        ScraperPopupFactory.addRow();
      };

      scope.getContent = function(arrayOfObj) {
        return getContent(arrayOfObj);
      };

      scope.saveData = function(attributes) {
        var cachedData = ScraperPopupFactory.get();
        ScraperPopupFactory.save(attributes, cachedData)
          .then(function(resp) {
            if (resp.status === 200) {
              scope.popupactivated = false;  
            }
            
          })
      };

      $rootScope.$on('click', function(evt, data, coordinates){
        scope.popupactivated = true;
        scope.left = coordinates.x;
        scope.top = coordinates.y;
        ScraperPopupFactory.reset();

        scope.popupData = ScraperPopupFactory.add(data).data;
        scope.currentContent = ScraperPopupFactory.getContent(scope.popupData);
        scope.attributes = scope.popupData;

        scope.selection = [];
        scope.selectedAttributes = function selectedAttribuets() {
          return scope.attributes.map(function(attribute) {
            if (attribute.selected) {
              return attribute;
            }
          });
        };
        
      });

    }
  };
});






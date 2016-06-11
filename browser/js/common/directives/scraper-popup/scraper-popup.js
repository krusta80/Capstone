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

      scope.saveData = function(attributes, isRepeating) {
        var cachedData = ScraperPopupFactory.get();
        ScraperPopupFactory.save(attributes, cachedData, isRepeating)
          .then(function(data) {
            if (data) {
              scope.popupactivated = false;
            }
          });
      };

      $rootScope.$on('click', function(evt, data, coordinates){
        console.log("data on click:", data);
        scope.popupactivated = true;
        scope.left = coordinates.x;
        scope.top = coordinates.y;
        ScraperPopupFactory.reset();
        console.log(data);
        var cached = ScraperPopupFactory.add(data);
        scope.popupData = cached.data;
        scope.rawData = cached.raw;
        scope.currentContent = ScraperPopupFactory.getContent(scope.popupData);
        scope.attributes = scope.popupData;
        scope.selection = [];
        scope.selectedAttributes = function selectedAttribuets(repeating) {
          var output = [];
          if (repeating)
            output = output.concat(scope.rawData.repeats);
          else {
            scope.attributes.forEach(function(attribute) {
              if (attribute.selected) {
                console.log(attribute);
                output.push(attribute);
              }
            });
          }
          return output;
        };
        scope.$apply();
      });

    }
  };
});

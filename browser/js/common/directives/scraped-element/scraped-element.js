
app.directive('scrapedElement', function($rootScope, ScraperElementFactory){
  return {
    restrict: 'E',
    templateUrl: '/js/common/directives/scraped-element/scraped-element.html',
    link: function(scope) {
      scope.scrapedElementData = ScraperElementFactory.get();
      scope.getNumber = function(num) {
        return new Array(num);
      };
      scope.setReset = function() {
        ScraperElementFactory.reset();
      };

      scope.isSelector = function(key) {
        return key != "selector"
      };
      scope.removeItem = function(obj) {
        ScraperElementFactory.remove(obj);
      };
      $rootScope.$on('extract', function(event,value) {
        ScraperElementFactory.add(value);
        scope.$apply();
      });
    }
  };
});



app.directive('scrapedElements', function($rootScope, ScraperElementFactory){
  return {
    restrict: 'E',
    templateUrl: '/js/common/directives/scraped-element/scraped-element.html',
    scope: {
      page: '='
    },
    link: function(scope, attr, link) {
      scope.scrapedPageObject = ScraperElementFactory.setAndGet(scope.page);
      scope.scrapedPageObject.targetElements.forEach(function(targetElem) {
        targetElem.fields = JSON.parse(targetElem.fields);
      });
      debugger;
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
        ScraperElementFactory.update(value);
      });
    }
  };
});

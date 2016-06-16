
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
        if (typeof targetElem.fields === 'string') {
          targetElem.fields = JSON.parse(targetElem.fields);
        }
      });
      scope.getNumber = function(num) {
        return new Array(num);
      };
      scope.setReset = function() {
        ScraperElementFactory.reset();
      };

      scope.isSelector = function(key) {
        return key != "selector"
      };
      scope.removeItem = function(target, key) {
        ScraperElementFactory.remove(target, key);
      };
      $rootScope.$on('extract', function(event,value) {
        scope.scrapedPageObject = ScraperElementFactory.update(value);
      });
    }
  };
});

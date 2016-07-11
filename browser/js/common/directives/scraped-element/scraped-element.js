
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
      scope.savePage = function() {
        var iframe = document.getElementById('iframedisplay').contentDocument;
        scope.scrapedPageObject.targetElements.forEach(function(targetElement, idx) {
            var selectedElement = iframe.querySelectorAll('.__chosenElement__' + idx);
            $(selectedElement).html(targetElement.name);
        });
        ScraperElementFactory.save();
      }
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
        var iframe = document.getElementById('iframedisplay').contentDocument;
        var scrollTop = iframe.body.scrollTop;
        value.targetElements.forEach(function(targetElement, idx) {
            // iframe.querySelectorAll(targetElement.domSelector)[targetElement.selectorIndex].className += " __clickActivate";
            var selectedElement = iframe.querySelectorAll(targetElement.domSelector)[targetElement.selectorIndex];
            var rectangle = selectedElement.getBoundingClientRect();
            var div = `<div class="__chosenElement__ __chosenElement__${idx}" style="width: ${rectangle.width}px; height: ${rectangle.height}px; position: absolute; left: ${rectangle.left}px; top: ${rectangle.top + scrollTop}px; background-color:rgba(0, 110, 190, 0.5); z-index: 10000; text-align: center; line-height: ${rectangle.height}px; color: white; font-weight: bold; pointer-events: none;">${targetElement.name}</div>`
            iframe.querySelector('body').innerHTML += div
        });
        scope.scrapedPageObject = ScraperElementFactory.update(value);
      });
    }
  };
});

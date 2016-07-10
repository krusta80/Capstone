app.directive('scraperPopup', function($rootScope, ScraperPopupFactory, PageFactory, Messenger){
  return {
    restric: 'E',
    templateUrl: '/js/common/directives/scraper-popup/scraper-popup.html',
    scope: {},
    transclude: true,
    link: function(scope) {
      var paginate = false;
      scope.popupactivated = false;
      ScraperPopupFactory.getPage()._actions = ScraperPopupFactory.getPage().actions.map(function(action){
        return JSON.parse(action);
      });
      scope.addRow = function(obj) {
        ScraperPopupFactory.addRow();
      };
      scope.getPage = ScraperPopupFactory.getPage;
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
      scope.setActionSelector = function(idx){
        var page = ScraperPopupFactory.getPage();
        var cached = ScraperPopupFactory.get();
        var actionSelector = '';
        cached.data.forEach(function(item){
          if (item.attr === 'class')
            actionSelector += '.' + item.value;
          if (item.attr === 'id')
            actionSelector+= '#' + item.value;
        });
        page._actions[idx].params[0] = actionSelector;
        page.actions = page._actions.map(function(action){
          return JSON.stringify(action);
        });
        PageFactory.update(page)
        .then(function(){
            scope.popupactivated = false;
          });
      };
      scope.setPaginator = function(){
        if (paginate){
          var page = ScraperPopupFactory.getPage();
          var cached = ScraperPopupFactory.get();
          var paginateSelector = '';
          cached.data.forEach(function(item){
            if (item.attr === 'id')
              paginateSelector+= '#' + item.value;
          });
          if (paginateSelector){ //for now, pagination element must have id attribute
            page.paginateSelector = paginateSelector;
            PageFactory.update(page)
            .then(function(){
                scope.hideAttributes = false;
                scope.popupactivated = false;
              });
          }

        }
      };
      scope.toggleAttributes = function(){
        scope.hideAttributes = !scope.hideAttributes;
        paginate = !paginate;
      };

      scope.cancel = function(index) {
        scope.popupactivated = false;
        var iframe = document.getElementById('iframedisplay').contentDocument;
        iframe.querySelectorAll('.__chosenElement__' + index)[0].remove();
      };

      $rootScope.$on('click', function(evt, data, coordinates){
        console.log("data on click:", data);
        scope.popupactivated = true;
        scope.left = coordinates.x-150;
        scope.top = coordinates.y-150;
        ScraperPopupFactory.reset();
        var cached = ScraperPopupFactory.add(data);
        scope.popupData = cached.data;
        scope.rawData = cached.raw;
        scope.dataIndex = (Messenger.getScraperFieldObj().targetElements.length + 1);
        scope.currentContent = ScraperPopupFactory.getContent(scope.popupData);
        scope.attributes = scope.popupData;
        scope.selection = [];
        scope.selectedAttributes = function selectedAttributes(repeating) {
          var output = [];
          if (repeating)
            output = output.concat(scope.rawData.repeats);
          else {
            scope.attributes.forEach(function(attribute) {
              if (attribute.selected) {
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

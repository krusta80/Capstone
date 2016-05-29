app.config(function ($stateProvider) {

    $stateProvider.state('iframe', {
        url: '/iframe',
        templateUrl: 'js/iframe/iframe.html',
        controller: 'IframeCtrl',
        resolve: {
          grid: function(Grid){
            return Grid.initGrid();
          }
        }
    });

});

app.controller('IframeCtrl', function ($scope, $http, Messenger, $rootScope, Grid) {
    $scope.loaded = false;
    $scope.url ='http://msnbc.com';
    $scope.saved = false;
    $scope.getRepeating = Messenger.isMultiple;
    $scope.setRepeating = Messenger.setMultiple;

    $scope.resetGrid = Grid.resetGrid;
    $scope.saveGrid = function(){
      Grid.saveGrid()
      .then(function(){
        $scope.saved = true; //TO DO:use toasts
      });
    };
    $scope.searchthis = function(url) {
        // document.getElementById('iframedisplay').src = "/api/scrape/proxy?proxyurl=" + url;

        // this is the downloaded version...
        Grid.resetGrid();
        Grid.setUrl(url);
        $http.post('/api/scrape/proxy', {proxyurl: url})
            .then(function(response) {
                var iframe = document.getElementById('iframedisplay');
                iframe.contentWindow.document.open();
                iframe.contentWindow.document.write(response.data);
                iframe.contentWindow.document.close();

                setTimeout(function() {
                    $scope.loaded = true;
                    $scope.$apply();
                    var iframecontents = $('#iframedisplay').contents()[0];
                    $(iframecontents).find('*').on('click', function(ev) {
                        //$scope.selector = Messenger.get();
                        var selector = Messenger.get();
                        if (selector){
                          $rootScope.$broadcast('extract', selector);
                          $scope.$evalAsync();
                        }
                        //ev.stopPropagation();
                        //ev.preventDefault();
                    });
                }, 0);
            })
            .catch(function(err) {
                console.log('there was an error');
            });
    };
});

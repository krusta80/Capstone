app.config(function ($stateProvider) {

    $stateProvider.state('iframe', {
        url: '/iframe/:pageid',
        templateUrl: 'js/iframe/iframe.html',
        controller: 'IframeCtrl',
        resolve: {
            page: function($stateParams, PageFactory) {
                return PageFactory.fetchById($stateParams.pageid)
            }
        }
    });

});

app.controller('IframeCtrl', function ($scope, $http, Messenger, $rootScope, page, ScraperPopupFactory) {
    $scope.loaded = false;
    $scope.loading = false;
    $scope.url ='http://msnbc.com';
    $scope.saved = false;
    $scope.page = page;

    $rootScope.$broadcast('sideBarClose')

    $scope.searchthis = function(url) {
        $http.post('/api/scrape/proxy', {proxyurl: url})
            .then(function(response) {
                $scope.loading = true;
                $scope.loaded = false;
                var iframe = document.getElementById('iframedisplay');
                iframe.contentWindow.document.open();
                iframe.contentWindow.document.write(response.data);
                iframe.contentWindow.document.close();

                setTimeout(function() {
                    var iframenode = $('#iframedisplay')[0];
                    iframenode.onload = function(ev) {
                        $scope.loaded = true; // this is for the overlay
                        $scope.loading = false; // this is to set the loader
                        $scope.$apply();

                        var iframe = document.getElementById('iframedisplay').contentDocument;

                        $scope.page.targetElements.forEach(function(targetElement, idx) {
                            // iframe.querySelectorAll(targetElement.domSelector)[targetElement.selectorIndex].className += " __clickActivate";
                            var selectedElement = iframe.querySelectorAll(targetElement.domSelector)[targetElement.selectorIndex];
                            var rectangle = selectedElement.getBoundingClientRect();
                            var div = `<div class="__chosenElement__ __chosenElement__${idx}" style="width: ${rectangle.width}px; height: ${rectangle.height}px; position: absolute; left: ${rectangle.left}px; top: ${rectangle.top}px; background-color:rgba(0, 110, 190, 0.5); text-align: center; line-height: ${rectangle.height}px; color: white; font-weight: bold; pointer-events: none;">${targetElement.name}</div>`
                            iframe.querySelector('body').innerHTML += div
                        });

                    };

                }, 0);
            })
            .catch(function(err) {
                console.log('there was an error');
            });
    };

    if (page) {
        $scope.url = page.url;
        ScraperPopupFactory.setPage(page);
        $scope.searchthis($scope.url);
    }
});

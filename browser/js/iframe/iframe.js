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

                        $scope.page.targetElements.forEach(function(targetElement) {
                            iframe.querySelectorAll(targetElement.domSelector)[targetElement.selectorIndex].className += " __clickActivate";
                        });
                        // var iframecontents = $('#iframedisplay').contents()[0];

                        // var iframebodycontents = $(iframecontents).find('body').find('*');
                        // $(iframebodycontents).find('*').on('click', function(ev) {
                        //     //$scope.selector = Messenger.get();

                        //     var selector = Messenger.get();
                        //     if (selector){
                        //         debugger;
                        //       $rootScope.$broadcast('extract', selector);
                        //       $scope.$evalAsync();
                        //     }
                        // });

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

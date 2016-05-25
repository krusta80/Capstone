app.config(function ($stateProvider) {

    $stateProvider.state('iframe', {
        url: '/iframe',
        templateUrl: 'js/iframe/iframe.html',
        controller: 'IframeCtrl'
    });

});

app.controller('IframeCtrl', function ($scope, $http, Messenger) {
    $scope.loaded = false;
    $scope.url ='http://msnbc.com';

    $scope.searchthis = function(url) {
        // document.getElementById('iframedisplay').src = "/api/scrape/proxy?proxyurl=" + url;

        // this is the downloaded version...

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
                        $scope.selector = Messenger.get();
                        $scope.$apply();
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

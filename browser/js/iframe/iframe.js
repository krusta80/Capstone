app.config(function ($stateProvider) {

    $stateProvider.state('iframe', {
        url: '/iframe',
        templateUrl: 'js/iframe/iframe.html',
        controller: 'IframeCtrl'
    });

});

app.controller('IframeCtrl', function ($scope, $http) {
    $scope.loaded = false;
    $scope.searchthis = function(url) {
        document.getElementById('iframedisplay').src = "/api/scrape/proxy?proxyurl=" + url;
                setTimeout(function() {
                    $scope.loaded = true; 
                    $scope.$apply(); 
                    var iframecontents = $('#iframedisplay').contents()[0];
                    // $(iframecontents).find('body').on('click', function(ev) {
                    //     ev.stopPropagation();
                    //     ev.preventDefault();
                    // });   
                }, 0)

    };
});
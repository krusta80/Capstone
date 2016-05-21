app.config(function ($stateProvider) {

    $stateProvider.state('iframe', {
        url: '/iframe',
        templateUrl: 'js/iframe/iframe.html',
        controller: 'IframeCtrl'
    });

});

app.controller('IframeCtrl', function ($scope, $http) {
    $scope.searchthis = function(url) {
        $http.post('/api/scrape/site', {url: url})
            .then(function(response) {
                debugger;
                document.getElementById('iframedisplay').src = response.data.publicDirectory;        
            })
            .catch(function(err) {
                console.log('there was an error');
            });
    };
});
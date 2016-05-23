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
        document.getElementById('iframedisplay').src = "/api/scrape/proxy?url=" + url;
        
        $('#iframedisplay').load(function(){
            $scope.loaded = true;    
            var iframecontents = $('#iframedisplay').contents()[0];
            $(iframecontents).find('body').on('click', function(ev) {
                ev.stopPropagation();
                ev.preventDefault();
            });    
            
        });
        
        // this is the downloaded version...
        
        // $http.post('/api/scrape/download', {url: url})
        //     .then(function(response) {
        //         document.getElementById('iframedisplay').src = response.data.publicDirectory;        
        //     })
        //     .catch(function(err) {
        //         console.log('there was an error');
        //     });

    };
});
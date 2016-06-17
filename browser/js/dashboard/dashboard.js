app.config(function ($stateProvider) {

    $stateProvider.state('dashboard', {
        url: '/dashboard',
        templateUrl: '/js/dashboard/dashboard.html',
        controller: 'DashboardCtrl'
    });

});

app.controller('DashboardCtrl', function ($scope, $stateParams, $state, DashboardFactory) {

    $scope.newChart = function(){
        $state.go('dashboard.chartSetup');
    };

    $scope.getCharts = function(){
        DashboardFactory.getCharts()
        .then(function(charts){
            $scope.charts = charts;
        })
    };

    $scope.getCharts();
    
    $scope.jsonCharts = function(){
        res.send($scope.getCharts());
    };


});
app.config(function ($stateProvider) {

    $stateProvider.state('dashboard', {
        url: '/dashboard',
        templateUrl: '/js/dashboard/dashboard.html',
        controller: 'DashboardCtrl',
        resolve: {
          user: function(AuthService){
            return AuthService.getLoggedInUser();
          }
        }
    });

});

app.controller('DashboardCtrl', function (user,$scope, $stateParams, $state, DashboardFactory) {
    //console.log('user',user);
    getCharts(user);

    function getCharts(){
        DashboardFactory.getCharts()
        .then(function(charts){
            $scope.charts = charts.map(function(chart){
              return DashboardFactory.loadChart(chart);
            });
        });
    }
    $scope.newChart = function(){
        $state.go('dashboard.chartSetup');
    };

    $scope.jsonCharts = function(){
        res.send($scope.getCharts());
    };


});

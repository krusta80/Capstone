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

app.controller('DashboardCtrl', function (user,$scope, $stateParams, $state, ChartFactory, DashboardFactory) {
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

    $scope.removeChart = function(id, idx){
      DashboardFactory.removeChart(id)
      .then(function(){
        $scope.charts.splice(idx, 1);
      });
    };

    $scope.editChart = function(chart){
      ChartFactory.setChart(chart);
      $state.go('charts', {id: chart._id});

    };



});

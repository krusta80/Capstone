app.config(function ($stateProvider) {

    $stateProvider.state('dashboard', {
        url: '/dashboard',
        templateUrl: '/js/dashboard/dashboard.html',
        controller: 'DashboardCtrl',
        resolve: {
          user: function(AuthService){
            return AuthService.getLoggedInUser();
          },
          projects: function(ProjectFactory){
            return ProjectFactory.fetchAll();
          }
        }
    });

});

app.controller('DashboardCtrl', function (user, projects, $scope,$stateParams, $state, ChartFactory, DashboardFactory, $timeout) {
    //console.log('user',user);
    getCharts(user);
    $scope.projects = projects;

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


    $scope.newChart = function(){
      ChartFactory.getNewChart()
      .then(function(chart){
        chart.name = "New chart";
        chart.chartType = "lineChart";
        chart.user = user._id;
        $scope.newChart = chart;
      });
    };

    $scope.goToDesigner = function(){
      var chart = $scope.newChart;
      chart.job = chart.job._id;
      chart.project = chart.project._id;
      $timeout(function(){
        $state.go('charts', {id: chart._id, new: true});
      }, 1000);

    };



});

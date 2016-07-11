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

app.controller('DashboardCtrl', function (user, projects, $scope,$stateParams, $state, ChartFactory, DashboardFactory, $timeout, ngDialog, $rootScope) {
    //console.log('user',user);
    $rootScope.$emit('sideBarOpen');
    getCharts(user);
    $scope.projects = projects;
    $scope.jobs = aggregate(projects, 'jobs');
    $scope.pages = aggregate($scope.jobs, 'pages');
    $scope.activeJobs = $scope.jobs.filter(function(job){
      return job.active;
    }).length;

    function aggregate(arr, val){
      return Array.prototype.reduce.call(arr, function(ac, item){
        ac = ac.concat(item[val]);
        return ac;
      }, []);
    }
    function getCharts(){
        DashboardFactory.getCharts()
        .then(function(charts){
            $scope.charts = charts.map(function(chart){
              return DashboardFactory.loadChart(chart);
            });
        });
    }

    $scope.removeChart = function(id, idx, charts){
      ngDialog.open({
        template: 'js/dashboard/dashboardDialog.html',
        className: 'ngdialog-theme-default',
        controller: function($scope,DashboardFactory){
          $scope.doRemove = function(){
            DashboardFactory.removeChart(id)
            .then(function(){
              charts.splice(idx, 1);
              ngDialog.close();
            });
          };
        }
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

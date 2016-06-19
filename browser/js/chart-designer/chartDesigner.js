app.config(function($stateProvider){
  $stateProvider
    .state('projects.project.jobChartDesigner', {
      url: '/job/:id/designer',
      templateUrl: 'js/chart-designer/chart-designer.html',
      resolve: {
        project: function(ProjectFactory, ChartFactory){
          return ProjectFactory.fetchById(ChartFactory.getChart().project);
        }
      },
      controller: function(project, ChartFactory, JobFactory, $scope, $rootScope){
        ChartFactory.setPages(project.jobs[JobFactory.findJobIndex(project.jobs, ChartFactory.getChart().job )].pages);

        function formatDate(date){
          var d = new Date(date);
          return d.toLocaleDateString('en-US', {
            day : 'numeric',
            month : 'numeric',
            year : 'numeric'
          }) + " " + d.toLocaleTimeString('en-US', {hour12:false, hour:'2-digit', minute:'2-digit'});
        }
        $scope.getFields = function(data){
          return Object.keys(data[0]).map(function(field, i){
            return {
              name: field,
              index: i
            };
          });
        };

        $scope.getPages = ChartFactory.getPages;
        $scope.getChart = ChartFactory.getChart;
        $scope.getOptions = ChartFactory.getOptions;

        $scope.toggleActive = function(idx){
          var page = $scope.getPages()[idx];
          if (!page.isActive){
            ChartFactory.fetchData(page)
            .then(function(page){
              page.isActive = true;
            });
          }
          page.isActive = false;
          $scope.redrawChart();
        };

        $scope.activePages = function(){
          return ChartFactory.getPages().some(function(page){
            return !!page.isActive;
          });
        };

        $scope.redrawChart = function(){
            $rootScope.$broadcast('recalc');
        };

        $scope.getDateRange = function(){
          return ChartFactory.getPages()[0].data.map(function(d, i){
            return {
              label: formatDate(d._time),
              value: d._time,
              index: i
            };
          }).sort();
        };
        $scope.saveChart = function(){
          ChartFactory.saveChart()
          .then(function(msg){
            $scope.message = msg;
          });
        };
      }
    });
});

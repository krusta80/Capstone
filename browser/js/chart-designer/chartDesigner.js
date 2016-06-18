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

        $scope.toggleActive = function(idx){
          var page = $scope.getPages()[idx];
          if (!page.isActive){
            ChartFactory.fetchData(page)
            .then(function(page){
              page.isActive = true;
            });
          }
          page.isActive = false;
        };

        $scope.activePages = function(){
          return ChartFactory.getPages().some(function(page){
            return !!page.isActive;
          });
        };

        $scope.redrawChart = function(page){
          //console.log(ChartFactory.getPages());
          if (page.selectedX && page.selectedY)
            $rootScope.$broadcast('recalc');
        };
      }
    });
});

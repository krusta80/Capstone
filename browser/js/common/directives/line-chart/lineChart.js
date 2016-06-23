app.directive('lineChart', function(){
  return {
    scope: {
      chart: '='
    },
    template: '<nvd3 data="data" options="options"></nvd3>',
    controller: function($scope, ChartFactory, DashboardFactory, $rootScope){
      $scope.data = [];
      $rootScope.$on('recalc', function(){
        var activePages = ChartFactory.getPages().filter(function(page){
          return page.isActive && (page.selectedX && page.selectedY);
        });
        if (activePages.length){
          $scope.options.chart.xAxis.axisLabel = ChartFactory.getChart().xLabel || 'X-Axis';
          $scope.options.chart.yAxis.axisLabel = ChartFactory.getChart().yLabel || 'Y-Axis';
          var options = ChartFactory.getOptions();
          $scope.data = activePages.map(function(page){
            var filteredData = page.data.filter(function(dp){
              return dp._time >= options.startDate.value && dp._time <= options.endDate.value;
            });
            return {
              key: page.title,
              values: filteredData.map(function(dataPoint){
                    return [dataPoint[page.selectedX.name], dataPoint[page.selectedY.name]];

              }),
              mean: page.data.reduce(function(acc,dp){
                return acc + dp[page.selectedY.name];
              },0) / page.data.length

            };
          });
        }
      });
      $scope.options = {
          chart: {
              type: 'lineChart',
              height: 450,
              margin : {
                  top: 20,
                  right: 20,
                  bottom: 60,
                  left: 65
              },
              x: function(d){ return d[0]; },
              y: function(d){ return d[1]; },
              average: function(d){ return d.mean; },

              color: d3.scale.category10().range(),
              duration: 300,
              useInteractiveGuideline: true,
              clipVoronoi: false,

              xAxis: {
                  axisLabel: 'X-Axis',
                  tickFormat: function(d) {
                      return d3.time.format('%m/%d/%y')(new Date(d));
                  },
                  showMaxMin: false,
                  staggerLabels: true
              },

              yAxis: {
                  axisLabel: 'Y-Axis',
                  tickFormat: function(d){
                      return d;
                  },
                  axisLabelDistance: -5
              }
          }
      };
      if ($scope.chart)
        build($scope.chart);
      function build(chart){
          var activePages = chart.pages.filter(function(page){
            return page.isActive && (page.selectedX && page.selectedY);
          });
          if (activePages.length){
            $scope.options.chart.xAxis.axisLabel = chart.xLabel;
            $scope.options.chart.yAxis.axisLabel = chart.yLabel;
            $scope.options.chart.height = 250;
            $scope.options.chart.width = 425;
            $scope.data = activePages.map(function(page){
              var filteredData = page.data.filter(function(dp){
                return dp._time >= chart.startDate.value && dp._time <= chart.endDate.value;
              });
              return {
                key: page.title,
                values: filteredData.map(function(dataPoint){
                      return [dataPoint[page.selectedX.name], dataPoint[page.selectedY.name]];

                }),
                mean: page.data.reduce(function(acc,dp){
                  return acc + dp[page.selectedY.name];
                },0) / page.data.length

              };
            });
          }

      }

    }
  };
});

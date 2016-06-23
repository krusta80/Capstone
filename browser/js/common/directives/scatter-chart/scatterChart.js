app.directive('scatterChart', function(){
  return {
    scope:{
      chart:'='
    },
    template: '<nvd3 data="data" options="options"></nvd3>',
    controller: function($scope, ChartFactory, $rootScope){
      $scope.data = [];
      $rootScope.$on('recalc', function(){
        var activePages = ChartFactory.getPages().filter(function(page){
          return page.isActive && (page.selectedX && page.selectedY && page.selectedR);
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
                    return {
                      x: dataPoint[page.selectedX.name],
                      y: dataPoint[page.selectedY.name],
                      size: dataPoint[page.selectedR.name],
                      shape: 'circle'
                    };
              })
            };
          });
        }
      });
      $scope.options = {
            chart: {
                type: 'scatterChart',
                height: 450,
                color: d3.scale.category10().range(),
                scatter: {
                    onlyCircles: false
                },
                showDistX: true,
                showDistY: true,
                tooltipContent: function(key) {
                    return '<h3>' + key + '</h3>';
                },
                duration: 350,
                xAxis: {
                    axisLabel: 'X Axis',
                    tickFormat: function(d){
                        return d;
                    }
                },
                yAxis: {
                    axisLabel: 'Y Axis',
                    tickFormat: function(d){
                        return d;
                    },
                    axisLabelDistance: -5
                },
                zoom: {
                    //NOTE: All attributes below are optional
                    enabled: false,
                    scaleExtent: [1, 10],
                    useFixedDomain: false,
                    useNiceScale: false,
                    horizontalOff: false,
                    verticalOff: false,
                    unzoomEventType: 'dblclick.zoom'
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
                        return {
                          x: dataPoint[page.selectedX.name],
                          y: dataPoint[page.selectedY.name],
                          size: dataPoint[page.selectedR.name],
                          shape: 'circle'
                        };
                  })

                };
              });
            }

        }

    }
  };
});

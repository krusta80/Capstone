app.directive('extractorGrid', function(){
  return {
    templateUrl: '/js/common/directives/extractor-grid/extractor-grid.html',
    controller: function($scope, $rootScope, Grid){
      Grid.initGrid();

      $scope.rowCount = 0;
      $rootScope.$on('extract', function(evt, data){
        if (data.multiple){
          Grid.resetGrid();
          Grid.addRows(data,data.selector);
        }
        else
          Grid.addRow(data);
      });
      $scope.getGrid = Grid.getGrid;
      $scope.getLongestRow = function(){
        var rows = Grid.getGrid();
        return rows.indexOf(rows.sort(function(a,b){
          return a.length - b.length;
        })[0]);
      };

    }
  };
});

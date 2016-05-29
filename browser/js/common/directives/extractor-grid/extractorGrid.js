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
        else{
          if ($scope.activeRow)
            Grid.replaceRow($scope.activeRow -1, data);
          else
            Grid.addRow(data);
        }
      });
      $scope.convertToNumber = function(field){
        Grid.convertToNumber(field);
      };
      $scope.removeCol = function(index){
        Grid.removeCol(index);
      };
      $scope.setActiveRow = function(index){
        if ($scope.activeRow===index)
          $scope.activeRow = null;
        else {
          $scope.activeRow = index;
        }
      };
      $scope.getGrid = Grid.getGrid;
      $scope.getFields = Grid.getFields;
      $scope.setFieldName = Grid.setFieldName;


    }
  };
});

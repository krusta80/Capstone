app.directive('extractorGrid', function($scope, $rootScope, Grid){
  return {
    templateUrl: '/js/common/directives/extractor-grid/extractor-grid.html',
    controller: function(){
      


      // Grid.initGrid();

      // $scope.rowCount = 0;
      // $rootScope.$on('extract', function(evt, data){
      //   console.log('extrac broadcast fired with data: ', data);

      //   if (data.multiple){
      //     Grid.resetGrid();
      //     Grid.addRows(data,data.selector);
      //   }
      //   else{
      //     if ($scope.activeRow)
      //       Grid.replaceRow($scope.activeRow -1, data);
      //     else
      //       Grid.addRow(data);
      //   }
      // });
      // $scope.convertToNumber = function(field){
      //   Grid.convertToNumber(field);
      // };
      // $scope.setActiveRow = function(index){
      //   if ($scope.activeRow===index)
      //     $scope.activeRow = null;
      //   else {
      //     $scope.activeRow = index;
      //   }
      // };
      // $scope.getGrid = Grid.getGrid;
      // $scope.getFields = Grid.getFields;
      // $scope.setFieldName = Grid.setFieldName;


    }
  };
});

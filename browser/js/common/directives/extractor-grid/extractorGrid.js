app.directive('extractorGrid', function(){
  return {
    templateUrl: '/js/common/directives/extractor-grid/extractor-grid.html',
    controller: function($scope, $rootScope, Grid){
      Grid.initGrid();

      $scope.rowCount = 0;
      $rootScope.$on('extract', function(evt, data){
          Grid.addRow(data);
      });
      $scope.getGrid = Grid.getGrid;
      $scope.getLongestRow = function(){
        var rows = Grid.getGrid();
        return rows.indexOf(rows.sort(function(a,b){
          return a.length - b.length;
        })[0]);
      };

      // $scope.getGrid = function(){
      //   var fields = grid.getFields();
      //   var len = fields.length;
      //   if (len){
      //     viewGrid.splice(0, viewGrid.length);
      //     var longestField = grid.getFields().sort(function(a,b){
      //       return grid.grid[b].length - grid.grid[a].length;
      //     })[0];
      //     for(var i = 0; i < grid.grid[longestField].length; i++){
      //       viewGrid[i] = [];
      //       for (var k = 0; k < len; k++){
      //         viewGrid[i].push(grid.grid[fields[k]][i]);
      //       }
      //     }
      //   }
      //   return viewGrid;
      // };
      // $scope.addField = function(){
      //   if ($scope.newField){
      //     grid.addField($scope.newField.name);
      //     $scope.fields.push($scope.newField.name);
      //   }
      // };
      // $scope.getFields = function(){
      //   return grid.getFields();
      // };
      // $scope.setActive = function(field){
      //   $scope.activeField = field;
      // };
    }
  };
});

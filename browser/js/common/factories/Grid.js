app.factory('Grid', function(){
  var grid;
  function GridRow(data){
    this.selector = data.selector;
    this.data = data.data;
  }
  function Grid(){
    this.grid = [];
  }
  // Grid.prototype.addField = function(fieldName){
  //   this.grid[fieldName] = [];
  // };
  // Grid.prototype.getFields = function(){
  //   return Object.keys(this.grid);
  // };
  // Grid.prototype.addData = function(field, data){
  //   var cell = new GridCell(data);
  //   this.grid[field].push(cell);
  // };
  return {
      initGrid: function(){
        if (!grid)
          grid = new Grid();
      },
      addRow: function(data){
        //normalize row length
        var newRow = new GridRow(data);
        var normalized = grid.grid.every(function(row){
          return row.data.length === newRow.data.length;
        });
        if (!normalized){
          var indexes = grid.grid.map(function(item, i){
            return item.data.length;
          });
          var longest = Math.max.apply(null, indexes);
          if (longest > newRow.data.length)
            for(var i = 0; i <= longest - newRow.data.length; i++)
              newRow.data.push({data:''});
          else{
            var diff = newRow.data.length - longest;
            for (var j = 0; j<grid.grid.length; j++){
              for(var k =0; k<diff; k++)
                grid.grid[j].data.push({data: ''});
            }
          }

        }
        grid.grid.push(new GridRow(data));

      },
      getGrid: function(){
        return grid.grid;
      }
  };
});

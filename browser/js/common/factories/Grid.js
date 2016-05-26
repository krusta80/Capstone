app.factory('Grid', function(){
  var grid;

  function normalize(newRow){
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
  function GridRow(data){
    this.selector = data.selector;
    this.data = data.data;
  }
  function Grid(){
    this.grid = [];
  }

  return {
      initGrid: function(){
          grid = new Grid();
      },
      resetGrid: function(){
        grid.grid.splice(0, grid.grid.length);
      },
      addRow: function(data){
        //normalize row length
        var newRow = new GridRow(data);
        var normalized = grid.grid.every(function(row){
          return row.data.length === newRow.data.length;
        });
        if (!normalized){
          normalize(newRow);
        }
        grid.grid.push(newRow);


      },
      addRows: function(dataArr, selector){
        for(var i = 0; i< dataArr.data.length; i++){
          var data = dataArr.data[i];
          console.log(data);
          grid.grid.push(new GridRow({data:data, selector: selector}));

        }

      },
      getGrid: function(){
        return grid.grid;
      }
  };
});

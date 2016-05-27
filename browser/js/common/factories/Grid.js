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
        for(var k =0; k<diff; k++){
          grid.grid[j].data.push({data: ''});
        }
      }
    }
  }

  function makeFields(row){
    if (row.data.length > grid.fieldNames.length){
      var diff = row.data.length - grid.fieldNames.length;
      for(var i =0; i< diff; i++)
        grid.fieldNames.push('Field ' + (grid.fieldNames.length + 1));
    }
  }
  function GridRow(data){
    this.selector = data.selector;
    this.data = data.data;
  }
  function Grid(){
    this.grid = [];
    this.fieldNames = [];
  }

  return {
      initGrid: function(){
          grid = new Grid();
      },
      resetGrid: function(){
        grid.grid.splice(0, grid.grid.length);
        grid.fieldNames.splice(0, grid.fieldNames.length);
      },
      addRow: function(data){
        //normalize row length
        var newRow = new GridRow(data);
        makeFields(newRow);
        var normalized = grid.grid.every(function(row){
          return row.data.length === newRow.data.length;
        });
        if (!normalized){
          normalize(newRow);
        }
        console.log(grid);
        grid.grid.push(newRow);


      },
      addRows: function(dataArr, selector){
        for(var i = 0; i< dataArr.data.length; i++){
          var data = dataArr.data[i];
          var newRow = new GridRow({data:data, selector: selector});
          makeFields(newRow);
          grid.grid.push(newRow);

        }

      },
      getGrid: function(){
        return grid.grid;
      },
      getFields: function(){
        return grid.fieldNames;
      },
      setFieldName: function(idx, name){
        grid.fieldNames[idx] = name;
      }
  };
});

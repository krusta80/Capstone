app.factory('Grid', function($http){
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
    if (row.data.length > grid.fields.length){
      var diff = row.data.length - grid.fields.length;
      for(var i =0; i< diff; i++)
        grid.fields.push({type: 'text', name: 'Field ' + (grid.fields.length + 1), convert: false});
    }
  }
  function GridRow(data){
    this.selector = data.selector;
    this.data = data.data;
    this.index = data.index;
  }
  // function Grid(){
  //   this.grid = [];
  //   this.fields = [];
  //   this.url = null;
  // }

  return {
      initGrid: function(){
        return $http.get('/api/pages/new')
        .then(function(res){
          grid = res.data;
        });

      },
      resetGrid: function(){
        grid.grid.splice(0, grid.grid.length);
        grid.fields.splice(0, grid.fields.length);
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
      convertToNumber: function(field){
        var colIdx = grid.fields.indexOf(field);
        for(var i =0; i < grid.grid.length; i++){
          grid.grid[i].data[colIdx].data = grid.grid[i].data[colIdx].data.replace(/\D/ig, "");
        }
        grid.fields[colIdx].convert = true;
      },
      removeCol: function(index){
        grid.fields.splice(index,1);
        grid.grid.forEach(function(row){
          row.data.splice(index, 1);
        });

      },
      replaceRow: function(index, data){
        var newRow = new GridRow(data);
        makeFields(newRow);
        normalize(newRow);
        grid.grid[index] = new GridRow(data);
      },
      getGrid: function(){
        return grid.grid;
      },
      getFields: function(){
        return grid.fields;
      },
      setFieldName: function(idx, name){
        grid.fields[idx].name = name;
      },
      saveGrid: function(){
        return $http.post('/api/pages', grid);
      },
      setUrl: function(url){
        grid.url = url;
      }
  };
});

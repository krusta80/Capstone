app.factory('Grid', function(){
  function GridCell(data){
    this.link = data.link;
    this.selector = data.selector;
    this.data = data.data;
  }
  function Grid(){
    this.grid = {};
  }
  Grid.prototype.addField = function(fieldName){
    this.grid[fieldName] = [];
  };
  Grid.prototype.getFields = function(){
    return Object.keys(this.grid);
  };
  Grid.prototype.addData = function(field, data){
    var cell = new GridCell(data);
    this.grid[field].push(cell);
  };
  return {
      newGrid: function(){
        return new Grid();
      }
  };
});

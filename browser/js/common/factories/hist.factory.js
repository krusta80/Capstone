app.factory('HistFactory', function($http){
  function truncate(str){
    if (str.length > 50)
      return str.slice(0,50) + '...';
    return str;
  }

  return {
    fetchByRunId: function(runId){
      return $http.get('/api/hists/byRunId/'+ runId)
      .then(function(res){
        return res.data;
      });
    },
    getDataGrid: function(hists){
      var fieldMap = {};
      var col= 0;
      var rows = hists.reduce(function(acc,hist){
        var histData = JSON.parse(hist.fields);
        acc.push(Object.keys(histData).reduce(function(ac, fieldName){
          if(!fieldMap.hasOwnProperty(fieldName)){
            fieldMap[fieldName] = col;
            col++;
          }
          ac.splice(fieldMap[fieldName], 0, truncate(histData[fieldName].value));
          return ac;
        },[]));
        return acc;
      },[]);
      return {
        fields: Object.keys(fieldMap),
        rows: rows
      };
    }
  };
});

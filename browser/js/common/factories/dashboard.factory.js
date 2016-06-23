app.factory('DashboardFactory', function($http) {

  function parsePages(pageArr){
    return pageArr.map(function(page){
      return JSON.parse(page);
    });
  }

  return {
    getCharts: function(){
      return $http.get('/api/charts')
      .then(function(response){
        return response.data;
      });
    },
    loadChart: function(chart){
      chart.pages = parsePages(chart.pages);
      chart.endDate = JSON.parse(chart.endDate);
      chart.startDate = JSON.parse(chart.startDate);
      return chart;
    },
    removeChart: function(chartId){
      return $http.delete('/api/charts/' + chartId);
    }
  };

});

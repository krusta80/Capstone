app.factory('ChartFactory', function($http) {

  var chart, pages = null, options ={};

  function parseData(data){
    return data.reduce(function(acc, item){
      var dataObj = JSON.parse(item.fields);
      Object.keys(dataObj).forEach(function(field){
        var dataVal = stringToNumber((dataObj[field].value));
        if (dataVal !== undefined)
          dataObj[field] = dataVal;
      });
      dataObj._time = item.jobRunTS;
      acc.push(dataObj);
      return acc;
    }, []);
  }

  function setMinMax(data){
    if (!options.startDate){
      var minMax = data.map(function(d){
        return Number(d._time);
      }).sort();
      options.startDate = { value: minMax[0] };
      options.endDate =  { value: minMax[minMax.length - 1]};
    }

  }

  function stringToNumber(str){
    return Number(str.replace(/\D/ig, ""));
  }

  function scrubPage(page){
    var keepFields = ['_id', 'title', 'url'];
    Object.keys(page).forEach(function(field){
      if (keepFields.indexOf(field) === -1)
        delete page[field];
    });
    return page;
  }


  return {
    setPages: function(jobPages){
      pages = jobPages.map(function(page){
        return scrubPage(page);
      });
    },
    getPages: function(){
      return pages;
    },
    getNewChart: function(){
      return $http.get('/api/charts/new')
      .then(function(res){
        chart = res.data;
        return chart;
      });
    },
    getPage: function(pageId){
      return pages[pageId];
    },
    getChart: function(){
      return chart;
    },
    fetchData: function(page){
      return $http.get('/api/hists/' + page._id )
      .then(function(res){
        if (res.data.length){
          page.data = parseData(res.data);
          setMinMax(page.data);
        }
        return page;
      });
    },
    saveChart: function(){
      chart.pages = [];
      pages.forEach(function(page){
        chart.pages.push(JSON.stringify(page));
      });
      chart.startDate = JSON.stringify(options.startDate);
      chart.endDate = JSON.stringify(options.endDate);
      return $http.post('/api/charts', chart)
      .then(function(res){
        return res.data;
      });
    },
    getOptions:function() {
      return options;
    },
    getData: function() {
      return data;
    },
    setData: function(_data) {
      data = _data;
    },
    setOptions: function(_options) {
      options = _options;
    },
    setChart: function(chartName) {
      this.setOptions(chartTypesMap[chartName].options);
      this.setData(chartTypesMap[chartName].data);
    }
  };
});

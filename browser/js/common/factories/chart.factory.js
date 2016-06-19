app.factory('ChartFactory', function($http, $q) {

  var chart, pages = null;

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
    if (!chart.startDate){
      var minMax = data.map(function(d){
        return Number(d._time);
      }).sort();
      chart.startDate = { value: minMax[0] };
      chart.endDate =  { value: minMax[minMax.length - 1]};
    }

  }

  function stringToNumber(str){
    return Number(str.replace(/\D/ig, ""));
  }


  return {
    setPages: function(jobPages){
      pages = jobPages;
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
        page.data = parseData(res.data);
        setMinMax(page.data);
        return page;
      });
    },
    saveChart: function(){
      chart.pages = [];
      pages.forEach(function(page){
        chart.pages.push(JSON.stringify(page));
      });
      chart.startDate = JSON.stringify(chart.startDate);
      chart.endDate = JSON.stringify(chart.endDate);
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
//
//   var xAxisLabel = 'Price';
//   var yAxisLabel = 'Stars Avg';
//
//   var chartTypesMap = {
//     scatterChart: {
//       options: {
//           chart: {
//               type: 'scatterChart',
//               height: 450,
//               color: d3.scale.category10().range(),
//               showDistX: true,
//               showDistY: true,
//             //tooltipContent: function(d) {
//             //    return d.series && '<h3>' + d.series[0].key + '</h3>';
//             //},
//               duration: 350,
//               xAxis: {
//                   axisLabel: xAxisLabel,
//                   tickFormat: function(d){
//                     //Sets how many decimal points are being displayed, here set to two
//                       return d3.format('.02f')(d);
//                   }
//               },
//               yAxis: {
//                   axisLabel: yAxisLabel,
//                   tickFormat: function(d){
//                       return d3.format('.02f')(d);
//                   },
//                   axisLabelDistance: -5
//               }
//           }
//         },
//         data: generateData(['Beats', 'Sennheiser', 'Bose'],40)
//     },
//     discreteBarChart: {
//       options: {
//               chart: {
//                   type: 'discreteBarChart',
//                   height: 450,
//                   margin : {
//                       top: 20,
//                       right: 20,
//                       bottom: 50,
//                       left: 55
//                   },
//                   x: function(d){
//                     return d.label;
//                   },
//                   y: function(d){
//                     return d.value;
//                   },
//                   showValues: true,
//                   valueFormat: function(d){
//                       return d3.format(',.4f')(d);
//                   },
//                   duration: 500,
//                   xAxis: {
//                       axisLabel: xAxisLabel
//                   },
//                   yAxis: {
//                       axisLabel: yAxisLabel,
//                       axisLabelDistance: -10
//                   }
//               }
//           },
//       data: [
//           {
//               key: "Cumulative Return",
//               values: [
//                   {
//                       "label" : "A" ,
//                       "value" : -29.765957771107
//                   } ,
//                   {
//                       "label" : "B" ,
//                       "value" : 0
//                   } ,
//                   {
//                       "label" : "C" ,
//                       "value" : 32.807804682612
//                   } ,
//                   {
//                       "label" : "D" ,
//                       "value" : 196.45946739256
//                   } ,
//                   {
//                       "label" : "E" ,
//                       "value" : 0.19434030906893
//                   } ,
//                   {
//                       "label" : "F" ,
//                       "value" : -98.079782601442
//                   } ,
//                   {
//                       "label" : "G" ,
//                       "value" : -13.925743130903
//                   } ,
//                   {
//                       "label" : "H" ,
//                       "value" : -5.1387322875705
//                   }
//               ]
//           }
//       ]
//     }
//   };
//   return chartFactoryObj;
//
//     /* Random Data Generator (took from nvd3.org) */
//   function generateData(groups, points) {
//       var data = [],
//           random = d3.random.normal();
//
//       for (var i = 0; i < groups.length; i++) {
//           data.push({
//               key: groups[i],
//               values: []
//           });
//
//           for (var j = 0; j < points; j++) {
//               data[i].values.push({
//                   x: random(),
//                   y: random(),
//                   size: Math.random(),
//                   shape: 'circle'
//               });
//           }
//       }
//       return data;
//   }
// });

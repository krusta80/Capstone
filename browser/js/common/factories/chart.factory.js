app.factory('ChartFactory', function() {
  var chartFactoryObj = {};

  var options = {},
      data = [];

  chartFactoryObj.getOptions = function() {
    console.log('options ', options)
    return options;
  };
  chartFactoryObj.getData = function() {
    return data;
  };
  chartFactoryObj.setData = function(_data) {
    data = _data;
    console.log('set Data hit', _data);
  };
  chartFactoryObj.setOptions = function(_options) {
    options = _options;
    console.log('set options hit', _options);
  };
  chartFactoryObj.setChart = function(chartName) {
    this.setOptions(chartTypesMap[chartName].options);
    this.setData(chartTypesMap[chartName].data);
  };

  var xAxisLabel = 'Price';
  var yAxisLabel = 'Stars Avg';

  var chartTypesMap = {
    scatterChart: {
      options: {
          chart: {
              type: 'scatterChart',
              height: 450,
              color: d3.scale.category10().range(),
              showDistX: true,
              showDistY: true,
            //tooltipContent: function(d) {
            //    return d.series && '<h3>' + d.series[0].key + '</h3>';
            //},
              duration: 350,
              xAxis: {
                  axisLabel: xAxisLabel,
                  tickFormat: function(d){
                    //Sets how many decimal points are being displayed, here set to two
                      return d3.format('.02f')(d);
                  }
              },
              yAxis: {
                  axisLabel: yAxisLabel,
                  tickFormat: function(d){
                      return d3.format('.02f')(d);
                  },
                  axisLabelDistance: -5
              }
          }
        },
        data: generateData(['Beats', 'Sennheiser', 'Bose'],40)
    },
    discreteBarChart: {
      options: {
              chart: {
                  type: 'discreteBarChart',
                  height: 450,
                  margin : {
                      top: 20,
                      right: 20,
                      bottom: 50,
                      left: 55
                  },
                  x: function(d){
                    return d.label;
                  },
                  y: function(d){
                    return d.value;
                  },
                  showValues: true,
                  valueFormat: function(d){
                      return d3.format(',.4f')(d);
                  },
                  duration: 500,
                  xAxis: {
                      axisLabel: xAxisLabel
                  },
                  yAxis: {
                      axisLabel: yAxisLabel,
                      axisLabelDistance: -10
                  }
              }
          },
      data: [
          {
              key: "Cumulative Return",
              values: [
                  {
                      "label" : "A" ,
                      "value" : -29.765957771107
                  } ,
                  {
                      "label" : "B" ,
                      "value" : 0
                  } ,
                  {
                      "label" : "C" ,
                      "value" : 32.807804682612
                  } ,
                  {
                      "label" : "D" ,
                      "value" : 196.45946739256
                  } ,
                  {
                      "label" : "E" ,
                      "value" : 0.19434030906893
                  } ,
                  {
                      "label" : "F" ,
                      "value" : -98.079782601442
                  } ,
                  {
                      "label" : "G" ,
                      "value" : -13.925743130903
                  } ,
                  {
                      "label" : "H" ,
                      "value" : -5.1387322875705
                  }
              ]
          }
      ]
    }
  };
  return chartFactoryObj;

    /* Random Data Generator (took from nvd3.org) */ 
  function generateData(groups, points) {
      var data = [],
          random = d3.random.normal();

      for (var i = 0; i < groups.length; i++) {
          data.push({
              key: groups[i],
              values: []
          });

          for (var j = 0; j < points; j++) {
              data[i].values.push({
                  x: random(),
                  y: random(),
                  size: Math.random(),
                  shape: 'circle'
              });
          }
      }
      return data;
  }
});

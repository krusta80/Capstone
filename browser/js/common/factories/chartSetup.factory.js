app.factory('ChartSetupFactory', function() {
  var chartSetupFactory = {};

  chartSetupFactory.getProjects = function(){
    //hit users for their projects
  };

  chartSetupFactory.getJobs = function (project){
    //hit project and return jobs within
  };

  chartSetupFactory.getPages = function (job){
    //hit job and return pages within
  };

  return chartSetupFactory;

});

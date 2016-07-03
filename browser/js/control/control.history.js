app.config(function($stateProvider){
  $stateProvider.state('control.history', {
    url: '/history',
    templateUrl: 'js/control/control-history.html',
    resolve: {
      project: function(ControlFactory){
        return ControlFactory.init();
      }
    },
    controller: function(project, $scope, $stateParams, HistFactory, ControlFactory){

      $scope.history = ControlFactory.getCurrentJob().runHistory.map(function(hist){
        var parsedHist = JSON.parse(hist);
        parsedHist.pages = Object.keys(parsedHist.pages).map(function(hist){
          var scraped = parsedHist.pages[hist] ? parsedHist.pages[hist].numElements : 0;
          var success = parsedHist.pages[hist] ? parsedHist.pages[hist].numSuccess : 0;
          return {
            id: hist,
            scraped: scraped,
            success: success,
            succeeded: success >= scraped
          };
        });
        return parsedHist;
      }).reverse();

      $scope.getData = function(run){
        HistFactory.fetchByRunId(run.runId)
        .then(function(data){
          console.log(data);
          $scope.hist = HistFactory.getDataGrid(data);
        });
      };
    }
  });
});

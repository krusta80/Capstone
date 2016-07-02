app.config(function($stateProvider){
  $stateProvider
    .state('control',{
      url: '/control',
      template: '<control-sidebar></control-sidebar><ui-view></ui-view>',
      abstract: true
    })
    .state('control.projects', {
      url: '/projects',
      templateUrl: 'js/control/control.projects.html',
      resolve: {
        projects: function(ControlFactory){
          return ControlFactory.init();
        }
      },
      controller: function(projects,$stateParams, $scope, ControlFactory, ProjectFactory,ChartFactory, ngDialog, $state, $timeout, $window){
        //ControlFactory.setProjects(projects);
        $scope.getCurrentJob = ControlFactory.getCurrentJob;
        $scope.getCurrentPage = ControlFactory.getCurrentPage;
        $scope.getPages = ControlFactory.getPages;
        $scope.savePage = ControlFactory.savePage;
        $scope.saveProject = function(){
          ControlFactory.saveProject();
        };
        $scope.showCustom = function(){
          return ['15','60','1440'].indexOf(ControlFactory.getCurrentJob().frequency) === -1;
        };
        $scope.addProject = function(){
          ControlFactory.addProject($scope.projectTitle);
        };
        $scope.addJob = function(){
          ControlFactory.addJob($scope.jobTitle);
        };
        $scope.removeJob = function(){
          var job = ControlFactory.getCurrentJob();
          ngDialog.open({
            template: 'js/projects/remove-dialog.html',
            className: 'ngdialog-theme-default',
            controller: function($scope, ControlFactory){
              $scope.job = job;
              $scope.doRemove = function(){
                ControlFactory.removeJob(job._id)
                .then(function(){
                  ngDialog.close();
                });

              };
            }

          });
        };
        $scope.viewPage = function(){
          $state.go('iframe', {pageid: ControlFactory.getCurrentPage()._id});
        };
        $scope.newChart = function(){
          ChartFactory.getNewChart()
          .then(function(chart){
            var project = ControlFactory.getCurrentProject();
            chart.name = "New chart";
            chart.chartType = "lineChart";
            chart.job = ControlFactory.getCurrentJob()._id;
            chart.user = project.user;
            chart.project = project._id;
            $scope.newChart = chart;
          });
        };
        $scope.goToDesigner = function(chartId){
          $timeout(function(){ //wait 1 sec for the modal to close
            $state.go('charts', {id: chartId, new: true});
          }, 1000);
        };
        $scope.runJob = function() {
            ControlFactory.runJob()
            .then(function(res) {
                $window.location.reload();
                console.log("Results object:", res);
            });
        };


      }
    });
});
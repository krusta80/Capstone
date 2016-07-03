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
      controller: function(projects,$stateParams, $scope, ControlFactory, ProjectFactory,ChartFactory, ngDialog, $state, $timeout, $window, $rootScope){
        //ControlFactory.setProjects(projects);
        $rootScope.$broadcast('sideBarClose', 'collapsed');
        $scope.getProjects = ControlFactory.getProjects;
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
            template: 'js/control/dialogs/remove-dialog-job.html',
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
        $scope.addAction = function(){
          var page = ControlFactory.getCurrentPage();
          if (!page._actions)
            page._actions = [];
          if (page.newAction){
            page._actions.push({fn:page.newAction, params:[]});
            ControlFactory.savePage();
          }
        };
        $scope.removeAction = function(idx){
          ControlFactory.getCurrentPage()._actions.splice(idx,1);
          ControlFactory.savePage();
        };
        $scope.parseActions = function(){
          var page = ControlFactory.getCurrentPage();
          if (!page._actions && page.actions && page.actions.length){
            page._actions = page.actions.map(function(action){
              return JSON.parse(action);
            });
          }
        };
        $scope.showAdvanced = function(){
          var page = ControlFactory.getCurrentPage();
          if (page.hasOwnProperty('showAdvanced'))
            return page.showAdvanced;
          if ((page.actions && page.actions.length) || page.paginate){
            page.showAdvanced = true;
            return true;
          }
          return false;
        };
        $scope.removePage = function(){
          ngDialog.open({
            template: 'js/control/dialogs/remove-dialog-page.html',
            className: 'ngdialog-theme-default',
            controller: function($scope,ControlFactory){
              $scope.doRemove = function(){
                ControlFactory.removePage()
                .then(function(){
                  ngDialog.close();
                });
              };
            }
          });
        };



      }
    });
});

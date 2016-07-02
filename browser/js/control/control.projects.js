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
      controller: function(projects,$stateParams, $scope, ControlFactory, ProjectFactory, ngDialog){
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

      }
    });
});

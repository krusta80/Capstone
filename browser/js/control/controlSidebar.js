app.directive('controlSidebar', function(){
  return {
    restrict: 'E',
    templateUrl: 'js/control/control-sidebar.html',
    controller: function($scope, $rootScope, ControlFactory, PageFactory, $state, ngDialog){
      $rootScope.$on('goToProject', function(evt,project){
        $scope.selectedProject = project;
      });
      $scope.selectedProject = ControlFactory.getCurrentProject();
      $scope.getProjects = ControlFactory.getProjects;
      $scope.getPages = ControlFactory.getPages;
      $scope.getCurrentJob = ControlFactory.getCurrentJob;
      $scope.getCurrentPage = ControlFactory.getCurrentPage;
      $scope.setCurrentPage = ControlFactory.setCurrentPage;


      $scope.callRefresh = function(type){
        $rootScope.emit('refresh', {type: type});
      };
      $scope.loadProject = function(){
        if ($scope.selectedProject){
          ControlFactory.setCurrentProject($scope.selectedProject)
          .then(function(){
            var currentJob = ControlFactory.getCurrentJob();
            if (currentJob && currentJob.pages && currentJob.pages.length){
              PageFactory.fetchByJobId(currentJob._id)
              .then(function(pages){
                ControlFactory.setPages(pages);
              });
            }

          });
        }
      };
      $scope.getCurrentProject = ControlFactory.getCurrentProject;
      $scope.loadJob = function(selectedJob){
        ControlFactory.setCurrentJob(selectedJob)
        .then(function(){
          return PageFactory.fetchByJobId(selectedJob._id);
          })
          .then(function(pages){
            ControlFactory.setPages(pages);
            if (!($state.is('control.projects')));
              $state.go('control.projects');
        });
      };
      $scope.addPage = function(){
        ControlFactory.addPage();
      };
      $scope.removeProject = function(){
        var project = ControlFactory.getCurrentProject();
        project.pageCount = project.jobs.reduce(function(acc,job){
          return acc + job.pages.length;
        }, 0);
        ngDialog.open({
          template: 'js/control/dialogs/remove-dialog-project.html',
          className: 'ngdialog-theme-default',
          controller: function($scope, ControlFactory){
            $scope.project = project;
            $scope.doRemove = function(){
              ControlFactory.removeProject()
              .then(function(){
                ngDialog.close();
                var currentJob = ControlFactory.getCurrentJob();
                if (currentJob && currentJob.pages && currentJob.pages.length){
                  PageFactory.fetchByJobId(currentJob._id)
                  .then(function(pages){
                    ControlFactory.setPages(pages);
                  });
                }
              });
            };
          }
        });

      };
    }
  };
});

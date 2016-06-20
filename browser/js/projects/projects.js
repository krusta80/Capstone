app.config(function ($stateProvider) {
    $stateProvider.state('projects', {
        url: '/projects',
        templateUrl: 'js/projects/projects.html',
        resolve: {
        	projects: function(ProjectFactory) {
        		return ProjectFactory.fetchAll();
        	}
        },
        controller: 'ProjectsCtrl'
    });
    $stateProvider.state('projects.project', {
        url: '/:projectId',
        templateUrl: 'js/projects/project.html',
        resolve: {
            project: function(ProjectFactory, $stateParams) {
                return ProjectFactory.fetchById($stateParams.projectId);
            }
        },
        controller: 'ProjectCtrl'
    });
    $stateProvider.state('projects.project.job', {
        url: '/job/:id',
        templateUrl: 'js/projects/job.html',
        resolve: {
            pages: function(PageFactory, $stateParams) {
                return PageFactory.fetchByJobId($stateParams.id);
            },
            jobId: function($stateParams) {
                return $stateParams.id;
            }
        },
        controller: 'JobCtrl'
    });
    $stateProvider.state('projects.project.jobHistory', {
      url: '/job/:id/history',
      templateUrl: 'js/projects/job-history.html',
      resolve: {
        project: function($stateParams, ProjectFactory){
          return ProjectFactory.fetchById($stateParams.projectId);
        }
      },
      controller: function(project, $scope, $stateParams){
        var job = _.filter(project.jobs, {_id: $stateParams.id});

        $scope.history = job[0].runHistory.map(function(hist){
          var parsedHist = JSON.parse(hist);
          parsedHist.pages = Object.keys(parsedHist.pages).map(function(hist){
            return {
              id: hist,
              scraped: parsedHist.pages[hist] ? parsedHist.pages[hist].numElements : 0,
              success: parsedHist.pages[hist] ? parsedHist.pages[hist].numSuccess : 0
            };
          });
          return parsedHist;
        }).reverse();
        console.log($scope.history);
      }
    });
});

app.controller('ProjectsCtrl', function(projects, ProjectFactory, JobFactory, $scope, $state) {
	$scope.projects = projects;
    $scope.noProjects = false;
    if (projects.length > 0) {
        // select the first product
        $state.go('projects.project', {projectId: $scope.projects[0]._id})
        $scope.noProjects = false;
    } else {
        $scope.noProjects = true;
    }

    $scope.addProject = function() {
        ProjectFactory.create({title: $scope.projectTitle})
        .then(function(project) {
            $scope.projects.push(project);
            $scope.selectedProject = project;
            $scope.loadProject(project);
        })
    };

    $scope.loadProject = function() {
        if(!$scope.selectedProject) {
            $scope.noProjects = true;
            $state.go('projects');
        } else {
            $scope.noProjects = false;
            $state.go('projects.project', {projectId: $scope.selectedProject._id})
        }

    };

    $scope.selectProject = function(project) {
        $scope.selectedProject = project;
        if (!project) {
            $scope.noProjects = true;
        } else {
            $scope.noProjects = false;
        }
    };

    $scope.getClass = function(project) {
        return $scope.selectedProject._id === project._id;
    };

});

app.controller('ProjectCtrl', function($rootScope, project, ProjectFactory, JobFactory, $scope, $state) {
    $scope.saveProject = function(job) {
        ProjectFactory.update($scope.project)
        .then(function(project) {
            $scope.project = project;
            $scope.$parent.jobs = $scope.project.jobs;
            if(job) {
                var jobIndex = JobFactory.findJobIndex($scope.jobs, job._id);
                if(jobIndex === -1)
                    jobIndex = $scope.jobs.length - 1;
                $scope.loadJob($scope.project.jobs[jobIndex]);
            }
            else
                $state.go('projects.project', {projectId: $scope.selectedProject._id})
        })
        //console.log("saving project", $scope.selectedProject);
    }

    $scope.addJob = function() {
        $scope.jobs.push({
            title: $scope.jobTitle,
            active: false
        });
        //$scope.selectedProject.jobs = $scope.jobs;
        //ProjectFactory.update($scope.selectedProject)

        $scope.saveProject($scope.jobs[$scope.jobs.length-1]);
    };

    $scope.$parent.loadJob = function(job) {
        $scope.job = job;
        //console.log("active job is", job);
        $state.go('projects.project.job', {id: job._id});
    };

    $scope.$parent.project = project;
    console.log("project id is", project._id);
    $scope.selectProject(project);
    $scope.$parent.jobs = project.jobs;
    $scope.job;

    if(project.jobs.length > 0)
        $scope.loadJob($scope.jobs[0]);

});

app.controller('JobCtrl', function($rootScope, jobId, pages, $timeout, ProjectFactory, JobFactory, PageFactory, ChartFactory, $scope, $state, $window) {
    //$scope.loadJob(JobFactory.findJobIndex($scope.jobs, jobId));
    $scope.$parent.$parent.pages = pages;

    if(!$scope.pages)
        $scope.pages = [];

    if($scope.pages.length > 0)
        $scope.$parent.$parent.selectedPage = $scope.pages.length - 1;

    $scope.$parent.$parent.addPage = function() {
        if(!isNaN($scope.selectedPage) && (!$scope.pages[$scope.selectedPage]._id))
            return;
        PageFactory.create({
            title: "new_page_" + Math.random().toString(10).slice(3,8),
            job: $scope.job._id,
            url: "http://www.abc.xyz"
        })
        .then(function(newPage) {
            console.log("newPage is", newPage);
            $scope.pages.push(newPage);
            $scope.job.pages.push(newPage._id);
            $scope.$parent.$parent.selectedPage = $scope.pages.length - 1;
            $scope.saveJob();
        })
        .then(function() {
            console.log("Job saved...");
        })
    };

    $scope.removeJob = function() {
        $scope.jobs.splice(JobFactory.findJobIndex($scope.jobs, $scope.job._id),1);
        if($scope.jobs.length > 0)
            $scope.saveProject($scope.jobs[0]);
        else
            $scope.saveProject();
        // JobFactory.remove($scope.job._id)
        // .then(function(removedJob) {
        //     $state.go('projects.project', {projectId: $scope.selectProject._id})
        // })
    };

    $scope.$parent.$parent.setSelected = function(ind) {
        console.log("dirty:", $scope.pageForm.$dirty);
        if(!isNaN($scope.selectedPage) && (!$scope.pages[$scope.selectedPage]._id || $scope.pageForm.$dirty))
            return;

        //  first we save the selectedPage
        PageFactory.update($scope.pages[$scope.selectedPage])
        .then(function(updatedPage) {
            $scope.$parent.$parent.selectedPage = ind;
        })
    };

    $scope.saveJob = function() {
        console.log("page to be saved is", $scope.pages[$scope.selectedPage]);
        console.log("job to be saved is", $scope.job);

        if($scope.pages.length > 0)
            PageFactory.update($scope.pages[$scope.selectedPage])
            .then(function(updatedPage) {
                console.log("page updated", updatedPage);
                $scope.$parent.$parent.pages[$scope.selectedPage] = updatedPage;
                $scope.saveProject($scope.job);
            });
        else
            $scope.saveProject($scope.job);
    };
    $scope.savePage = function(){
      return PageFactory.update($scope.pages[$scope.selectedPage])
      .then(function(page){
        $scope.pageSaved = true;
        console.log('saved:',page);
      });
    };

    $scope.removePage = function() {
        $scope.job.pages.splice($scope.selectedPage,1);
        if($scope.pages[$scope.selectedPage]._id)
            PageFactory.remove($scope.pages[$scope.selectedPage]._id)
            .then(function(page) {
                console.log("Removed page", page);
                $scope.$parent.$parent.pages.splice($scope.selectedPage,1);

                if($scope.selectedPage > 0)
                    $scope.selectedPage--;
                else
                    delete $scope.selectedPage;

                $scope.saveJob();
                //$scope.pageForm.$setPristine();
            })
        else {
            $scope.pages.splice($scope.selectedPage,1);
            if($scope.selectedPage > 0)
                $scope.selectedPage--;
            else
                delete $scope.selectedPage;

            $scope.saveJob();
            //$scope.pageForm.$setPristine();
        }

    };

    $scope.runJob = function() {
        JobFactory.runJob($scope.project._id, JobFactory.findJobIndex($scope.jobs, $scope.job._id))
        .then(function(rez) {
            $window.location.reload();
            console.log("Results object:", rez);
        });
    };

    $scope.viewPage = function() {
        $state.go('iframe', {pageid: $scope.pages[$scope.selectedPage]._id});
    };

    $scope.reportSuccess = function() {
        $scope.success = true;
        setTimeout(function() {
            $scope.success = false;
            $scope.$apply();
        }.bind(this), 2000);
    };

    $scope.newChart = function(){
      ChartFactory.getNewChart()
      .then(function(chart){
        chart.name = "New chart";
        chart.chartType = "lineChart";
        chart.job = $scope.job._id;
        chart.project = $scope.project._id;
        $scope.newChart = chart;
      });
    };

    $scope.goToDesigner = function(jobId){
      $timeout(function(){ //wait 1 sec for the modal to close
        $state.go('projects.project.jobChartDesigner', {id: jobId});
      }, 1000);
    };
});

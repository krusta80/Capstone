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
    $stateProvider.state('projects.job', {
        url: '/:id',
        templateUrl: 'js/projects/job.html',
        resolve: {
            job: function(JobFactory, $stateParams) {
                return JobFactory.fetchById($stateParams.id);
            }
        },
        controller: 'JobCtrl'
    });
});

app.controller('ProjectsCtrl', function(projects, ProjectFactory, JobFactory, $scope, $state) {
	$scope.projects = projects;
    $scope.activeJob = -1;
    $scope.fromChild = false;

    $scope.loadProject = function() {
        if($scope.selectedProject)
            JobFactory.fetchByProjectId($scope.selectedProject._id)
            .then(function(jobs) {
                $scope.jobs = jobs;
                if(!$scope.jobs.length) {
                    $scope.activeJob = undefined;
                    $state.go('projects');
                }
                else {
                    if($scope.fromChild)
                        $scope.loadJob($scope.activeJob);
                    else
                        $scope.loadJob(jobs[0]);
                    $scope.fromChild = false;
                }
            })
        else {
            $scope.jobs = [];
            $scope.activeJob = -1;
            $state.go('projects');
        }  
    };

    $scope.loadJobs = function(project) {
         return JobFactory.fetchByProjectId(project._id)
        .then(function(jobs) {
            $scope.jobs = jobs;
         });   
    }

    $scope.addProject = function() {
        ProjectFactory.create({title: $scope.projectTitle})
        .then(function(project) {
            $scope.projects.push(project);
            $scope.jobs = [];
            $scope.project = project;
            $scope.loadProject(project);
        })
    };

    $scope.addJob = function() {
        $scope.jobs.push({
            title: $scope.jobTitle,
            active: false
        });
        $scope.selectedProject.jobs = $scope.jobs;
        
        ProjectFactory.update($scope.selectedProject)
        .then(function(project) {
            $scope.selectedProject = project;
            $scope.jobIndex = $scope.jobs.length - 1;
            $scope.loadJob($scope.selectedProject.jobs[$scope.jobIndex]);
        })
    };

    $scope.loadJob = function(job) {
        $scope.activeJob = job;
        console.log("active job is", job);
        $state.go('projects.job', {id: job._id});
    };

    $scope.switchProject = function(project) {
        $scope.selectedProject = project;
        $scope.fromChild = true;
    };
});

app.controller('JobCtrl', function(job, ProjectFactory, JobFactory, PageFactory, $scope) {
    job = $scope.activeJob;
    // if(!$scope.selectedProject)
    //     ProjectFactory.fetchById(job.Project)
    //     .then(function(project) {
    //         $scope.switchProject(project);
    //         $scope.loadJob(job);
    //         return $scope.loadJobs(project);
    //     })
    //     .then(function() {
    //         $scope.loadProject();
    //     });

    console.log("job is", job);
    $scope.job = job;
    $scope.pages = job.pages;

    if($scope.pages.length > 0)
        $scope.selectedPage = $scope.pages.length - 1;

    $scope.addPage = function() {
        if(!isNaN($scope.selectedPage) && (!$scope.pages[$scope.selectedPage]._id || $scope.pageForm.$dirty))
            return;
        $scope.pages.push({
            name: "new_page_" + Math.random().toString(10).slice(3,8), 
            Job: job,
            select: true
        });
        $scope.selectedPage = $scope.pages.length - 1;
        $scope.buildEnumString();
    };

    $scope.setSelected = function(ind) {
        console.log("dirty:", $scope.pageForm.$dirty);
        if(!isNaN($scope.selectedPage) && (!$scope.pages[$scope.selectedPage]._id || $scope.pageForm.$dirty))
            return;
        $scope.selectedPage = ind;
    };

    $scope.buildEnumString = function() {
        if($scope.pages[$scope.selectedPage].enum)
            $scope.pages[$scope.selectedPage].enumString = $scope.pages[$scope.selectedPage].enum.join(",");
    };

    $scope.savePage = function() {
        if($scope.pageForm.$pristine)
            return;
        if($scope.pages[$scope.selectedPage]._id)
            PageFactory.update($scope.pages[$scope.selectedPage])
            .then(function(page) {
                $scope.pages[$scope.selectedPage] = page;
                $scope.pageForm.$setPristine();
                $scope.reportSuccess();
            })
        else
            PageFactory.create($scope.pages[$scope.selectedPage])
            .then(function(page) {
                $scope.pages[$scope.selectedPage] = page;
                $scope.pageForm.$setPristine();
                $scope.reportSuccess();
            })
    };

    $scope.removePage = function() {
        if($scope.pages[$scope.selectedPage]._id)
            PageFactory.remove($scope.pages[$scope.selectedPage]._id)
            .then(function(page) {
                $scope.pages.splice($scope.selectedPage,1);
                if($scope.pages.length === $scope.selectedPage) {
                    if($scope.selectedPage > 0)
                        $scope.selectedPage--;
                    else
                        delete $scope.selectedPage;
                }
                $scope.pageForm.$setPristine();
            })
        else {
            $scope.pages.splice($scope.selectedPage,1);
            if($scope.pages.length === $scope.selectedPage) {
                if($scope.selectedPage > 0)
                    $scope.selectedPage--;
                else
                    delete $scope.selectedPage;
            }
            $scope.pageForm.$setPristine();
        }
    };

    $scope.reportSuccess = function() {
        $scope.success = true;
        setTimeout(function() {
            $scope.success = false;
            $scope.$apply();
        }.bind(this), 2000);
    };
});
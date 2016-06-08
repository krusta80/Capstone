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
});

app.controller('ProjectsCtrl', function(projects, ProjectFactory, JobFactory, $scope, $state) {
	$scope.projects = projects;
    
    $scope.addProject = function() {
        ProjectFactory.create({title: $scope.projectTitle})
        .then(function(project) {
            $scope.projects.push(project);
            $scope.selectedProject = project;
            $scope.loadProject(project);
        })
    };

    $scope.loadProject = function() {
        if(!$scope.selectedProject)
            $state.go('projects');
        else    
            $state.go('projects.project', {projectId: $scope.selectedProject._id})
    };

    $scope.selectProject = function(project) {
        $scope.selectedProject = project;
    };

});

app.controller('ProjectCtrl', function(project, ProjectFactory, JobFactory, $scope, $state) {
    $scope.saveProject = function(job) {
        ProjectFactory.update($scope.project)
        .then(function(project) {
            $scope.project = project;
            $scope.jobs = $scope.project.jobs;
            var jobIndex = JobFactory.findJobIndex($scope.jobs, job._id);
            if(jobIndex === -1)
                jobIndex = $scope.jobs.length - 1;    
            $scope.loadJob($scope.project.jobs[jobIndex]);
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
        $scope.saveProject($scope.jobs.length-1);
    };

    $scope.loadJob = function(job) {
        $scope.job = job;
        //console.log("active job is", job);
        $state.go('projects.project.job', {id: job._id});
    };

    $scope.project = project;
    console.log("project id is", project._id);
    $scope.selectProject(project);
    $scope.jobs = project.jobs;
    $scope.job;

    if(project.jobs.length > 0)
        $scope.loadJob($scope.jobs[0]);
    
});

app.controller('JobCtrl', function(jobId, pages, ProjectFactory, JobFactory, PageFactory, $scope, $state) {
    //$scope.loadJob(JobFactory.findJobIndex($scope.jobs, jobId));
    $scope.pages = pages;
    
    if(!$scope.pages)
        $scope.pages = [];

    if($scope.pages.length > 0)
        $scope.selectedPage = $scope.pages.length - 1;

    $scope.addPage = function() {
        if(!isNaN($scope.selectedPage) && (!$scope.pages[$scope.selectedPage]._id || $scope.pageForm.$dirty))
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
            $scope.selectedPage = $scope.pages.length - 1;    
        });
    };

    $scope.setSelected = function(ind) {
        console.log("dirty:", $scope.pageForm.$dirty);
        if(!isNaN($scope.selectedPage) && (!$scope.pages[$scope.selectedPage]._id || $scope.pageForm.$dirty))
            return;
        
        //  first we save the selectedPage
        PageFactory.update($scope.pages[$scope.selectedPage])
        .then(function(updatedPage) {
            $scope.selectedPage = ind;    
        })
    };

    $scope.saveJob = function() {
        console.log("page to be saved is", $scope.pages[$scope.selectedPage]);
        console.log("job to be saved is", $scope.job);

        if($scope.pages.length > 0)
            PageFactory.update($scope.pages[$scope.selectedPage])
            .then(function(updatedPage) {
                console.log("page updated", updatedPage);
                $scope.pages[$scope.selectedPage] = updatedPage;
                $scope.saveProject($scope.job);   
            });
        else
            $scope.saveProject($scope.job);   
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

    $scope.viewPage = function() {
        $state.go('iframe', {pageid: $scope.pages[$scope.selectedPage]._id});
    }

    $scope.reportSuccess = function() {
        $scope.success = true;
        setTimeout(function() {
            $scope.success = false;
            $scope.$apply();
        }.bind(this), 2000);
    };
});
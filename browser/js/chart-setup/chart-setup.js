app.config(function ($stateProvider) {

    $stateProvider.state('chartSetup', {
        url: '/chart-setup',
        templateUrl: '/js/chart-setup/chart-setup.html',
        controller: 'ChartSetupCtrl'
    });

});

app.controller('ChartSetupCtrl', function ($scope, $stateParams, $state, ChartSetupFactory) {
    $scope.data;
    $scope.params = {
        // jobs: ChartSetupFactory.getJobs($scope.params.selectedProject),
        // pages: ChartSetupFactory.getPages($scope.params.selectedJob),
        chartTypes: ['scatterChart', 'discreteBarChart'] //dropdown, needs to be modularized eventually
    };
    //$scope.saveData = ChartSetupFactory.saveData($scope.data);

    //reference user projects
    ChartSetupFactory.getProjects()
    .then(function(projects) {
        $scope.params.projects = projects;
    });

    $scope.getJobs = function(){
        console.log("Running, project is: ",$scope.data.project)
        ChartSetupFactory.getJobs($scope.data.project)
        .then(function(jobs){
            console.log("jobs are: ",jobs);
            $scope.params.jobs = jobs;
        })
    };

});

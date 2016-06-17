app.config(function ($stateProvider) {

    $stateProvider.state('chartSetup', {
        url: '/chart-setup',
        templateUrl: '/js/chart-setup/chart-setup.html',
        controller: 'ChartSetupCtrl'
    });

});

app.controller('ChartSetupCtrl', function ($scope, $stateParams, $state, ChartSetupFactory) {

    $scope.data;

    ChartSetupFactory.getProjects()
    .then(function(projects) {
        $scope.projects = projects;
    });

    $scope.getJobs = function(){
        ChartSetupFactory.getJobs($scope.data.project)
        .then(function(jobs){
            $scope.jobs = jobs;
        })
    };

    $scope.getPages = function(){
        ChartSetupFactory.getPages($scope.data.job)
        .then(function(pages){
            $scope.pages = pages;
        });
    };

    $scope.chartTypes = ['scatterChart', 'discreteBarChart']; //dropdown, needs to be modularized eventually

    $scope.saveChart = function(){
        ChartSetupFactory.saveChart($scope.data);
    };

});

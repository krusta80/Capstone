app.config(function ($stateProvider) {

    $stateProvider.state('chartSetup', {
        url: '/chart-setup',
        templateUrl: 'js/chart-setup/chart-setup.html',
        controller: 'ChartSetupCtrl'
    });

});

app.controller('ChartSetupCtrl', function ($scope, $stateParams, $state, chartSetupFactory) {

    $scope.params = {
        chartName: $scope.chartName, //free text
        selectedProject: $scope.project, //dropdown
        projects: chartSetupFactory.getProjects(), //reference to user projects
        selectedJob: $scope.job, //dropdown dependent on project
        jobs: chartSetupFactory.getJobs($scope.params.selectedProject),
        selectedPage: $scope.page, //multiple select
        pages: chartSetupFactory.getPages($scope.params.selectedJob),
        selectedChartType: $scope.chartType,
        chartTypes: ['scatterChart', 'discreteBarChart'], //dropdown, needs to be modularized eventually
        historical: $scope.historical //boolean
    };

});

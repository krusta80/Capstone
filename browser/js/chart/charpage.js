app.config(function ($stateProvider) {

    $stateProvider.state('chart', {
        url: '/chart/:chartname',
        templateUrl: 'js/chart/chartpage.html',
        controller: 'ChartCtrl',

    });

});

app.controller('ChartCtrl', function ($scope, $rootScope, ChartFactory, $stateParams, $state) {
    // set a default chart here
    var route = $stateParams.chartname ? $stateParams.chartname : 'scatterChart';
    ChartFactory.setChart(route);

    $scope.options = ChartFactory.getOptions();
    $scope.data = ChartFactory.getData();
    $scope.chartName = route;

    $scope.params = {
        mode: "basic",
        visible: true,
        disabled: false,
        selectedChart: $scope.chartName,
        charts: ['scatterChart', 'discreteBarChart']
    };
    
    $scope.selectChart = function(chart) {
        $state.go('chart', {chartname: chart});
    };
});

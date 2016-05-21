app.config(function ($stateProvider) {
    $stateProvider.state('appBuilder', {
        url: '/app-builder',
        templateUrl: 'js/app-builder/app-builder.html',
        resolve: {
        	apps: function(AppFactory) {
        		return AppFactory.fetchAll();
        	}
        },
        controller: 'AppBuilderCtrl'
    });
});

app.controller('AppBuilderCtrl', function(apps, $scope) {
	apps.unshift({id: -1, name: 'Select an App'});
    $scope.appIndex = 0;
    $scope.apps = apps;
    console.log("Apps", apps);
});
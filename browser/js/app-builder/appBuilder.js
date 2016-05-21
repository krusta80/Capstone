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
    $stateProvider.state('appBuilder.schema', {
        url: '/app-builder/:id',
        templateUrl: 'js/app-builder/schema.html',
        resolve: {
            schema: function(SchemaFactory, $stateParams) {
                return SchemaFactory.fetchByAppId($stateParams.id);
            }
        },
        controller: 'SchemaCtrl'
    });
});

app.controller('AppBuilderCtrl', function(apps, AppFactory, SchemaFactory, $scope) {
	apps.unshift({id: -1, name: 'Select an App'});
    $scope.appIndex = 0;
    $scope.apps = apps;
    $scope.activeSchema = -1;
    
    $scope.loadApp = function() {
        SchemaFactory.fetchByAppId($scope.apps[$scope.appIndex])
        .then(function(schemas) {
            $scope.schemas = schemas;
        })
    };
});

app.controller('SchemaCtrl', function(schema, AppFactory, SchemaFactory, $scope) {

});
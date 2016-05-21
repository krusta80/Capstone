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
        url: '/:id',
        templateUrl: 'js/app-builder/schema.html',
        resolve: {
            schema: function(SchemaFactory, $stateParams) {
                return SchemaFactory.fetchById($stateParams.id);
            }
        },
        controller: 'SchemaCtrl'
    });
});

app.controller('AppBuilderCtrl', function(apps, AppFactory, SchemaFactory, $scope, $state) {
	$scope.appId = -1;
    $scope.apps = apps;
    $scope.activeSchema = -1;
    
    $scope.loadApp = function(app) {
        if(app)
            SchemaFactory.fetchByAppId(app._id)
            .then(function(schemas) {
                $scope.appId = app._id;
                $scope.schemas = schemas;
                if(!$scope.schemas.length) {
                    $scope.activeSchema = undefined;
                    $state.go('appBuilder');
                }
                else
                    $scope.loadSchema(schemas[0]);
            })
        else {
            $scope.appId = -1;
            $scope.schemas = [];
            $scope.activeSchema = undefined;
            $state.go('appBuilder');
        }
        
    };

    $scope.addApp = function() {
        AppFactory.create({name: $scope.appName})
        .then(function(app) {
            $scope.apps.push(app);
            $scope.schemas = [];
            $scope.app = app;
            $scope.loadApp(app);
        })
    };

    $scope.addSchema = function() {
        SchemaFactory.create({name: $scope.schemaName, App: $scope.appId})
        .then(function(schema) {
            $scope.schemas.push(schema);
            $scope.schemaIndex = $scope.schemas.length - 1;
            $scope.loadSchema(schema);
        })
    };

    $scope.loadSchema = function(schema) {
        $scope.activeSchema = schema;
        $state.go('appBuilder.schema', {id: schema._id});
    };
});

app.controller('SchemaCtrl', function(schema, AppFactory, SchemaFactory, $scope) {
    $scope.schema = schema;
});
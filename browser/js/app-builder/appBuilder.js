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
            },
            fields: function(FieldFactory, $stateParams) {
                return FieldFactory.fetchBySchemaId($stateParams.id);
            }
        },
        controller: 'SchemaCtrl'
    });
});

app.controller('AppBuilderCtrl', function(apps, AppFactory, SchemaFactory, $scope, $state) {
	$scope.apps = apps;
    $scope.activeSchema = -1;
    $scope.fromChild = false;

    $scope.loadApp = function() {
        if($scope.selectedApp)
            SchemaFactory.fetchByAppId($scope.selectedApp._id)
            .then(function(schemas) {
                $scope.schemas = schemas;
                if(!$scope.schemas.length) {
                    $scope.activeSchema = undefined;
                    $state.go('appBuilder');
                }
                else {
                    if($scope.fromChild)
                        $scope.loadSchema($scope.activeSchema);
                    else
                        $scope.loadSchema(schemas[0]);
                    $scope.fromChild = false;
                }
            })
        else {
            $scope.schemas = [];
            $scope.activeSchema = -1;
            $state.go('appBuilder');
        }  
    };

    $scope.loadSchemas = function(app) {
         return SchemaFactory.fetchByAppId(app._id)
        .then(function(schemas) {
            $scope.schemas = schemas;
         });   
    }

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
        SchemaFactory.create({name: $scope.schemaName, App: $scope.selectedApp._id})
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

    $scope.switchApp = function(app) {
        $scope.selectedApp = app;
        $scope.fromChild = true;
    };
});

app.controller('SchemaCtrl', function(schema, fields, AppFactory, SchemaFactory, $scope) {
    if(!$scope.selectedApp)
        AppFactory.fetchById(schema.App)
        .then(function(app) {
            $scope.switchApp(app);
            $scope.loadSchema(schema);
            return $scope.loadSchemas(app);
        })
        .then(function() {
            $scope.loadApp();
        });
    
    $scope.schema = schema;
    $scope.fields = fields;

    $scope.addField = function() {
        if(!isNaN($scope.selectedField) && !$scope.fields[selectedField]._id)
            return;
        $scope.fields.push({name: "new_field_" + Math.random().toString(10).slice(3,8)});
        $scope.selectedField = $scope.fields.length - 1;
        $scope.buildEnumString();
    };

    $scope.buildEnumString = function() {
        if($scope.fields[$scope.selectedField].enum)
            $scope.fields[$scope.selectedField].enumString = $scope.fields[$scope.selectedField].enum.join(",");
    };
});
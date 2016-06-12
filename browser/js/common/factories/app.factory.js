app.factory('AppFactory', function ($http) {
    var parseData = function(res) {
    	return res.data;
    };

    return {
    	fetchAll: function() {
    		return $http.get('/api/apps')
    		.then(parseData);
    	},
    	fetchById: function(id) {
    		return $http.get('/api/apps/' + id)
    		.then(parseData);
    	},
    	create: function(app) {
    		return $http.post('/api/apps', app)
    		.then(parseData);
    	},
    	update: function(app) {
    		return $http.put('/api/apps/' + app._id, app)
    		.then(parseData);
    	},
    	remove: function(id) {
    		return $http.delete('/api/apps/' + id)
    		.then(parseData);
    	}
    };
});

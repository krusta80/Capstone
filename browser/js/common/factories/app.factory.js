app.factory('AppFactory', function ($http) {
    var parseData = function(res) {
    	return res.data;
    };

    return {
    	fetchAll: function() {
    		$http.get('/api/apps')
    		.then(parseData)
    	},
    	fetchById: function(id) {
    		$http.get('/api/apps/' + id)
    		.then(parseData)
    	},
    	create: function(app) {
    		$http.post('/api/apps', app)
    		.then(parseData)
    	},
    	update: function(app) {
    		$http.put('/api/apps/' + app._id, app)
    		.then(parseData)
    	},
    	remove: function(id) {
    		$http.delete('/api/apps/' + id)
    		.then(parseData)
    	}
    }
});
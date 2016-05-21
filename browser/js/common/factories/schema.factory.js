app.factory('SchemaFactory', function ($http) {
    var parseData = function(res) {
    	return res.data;
    };

    return {
    	fetchByAppId: function(appId) {
    		return $http.get('/api/schemas/byApp/' + appId)
    		.then(parseData)
    	},
    	fetchById: function(id) {
    		return $http.get('/api/schemas/' + id)
    		.then(parseData)
    	},
    	create: function(schema) {
    		return $http.post('/api/schemas', schema)
    		.then(parseData)
    	},
    	update: function(schema) {
    		return $http.put('/api/schemas/' + schema._id, schema)
    		.then(parseData)
    	},
    	remove: function(id) {
    		return $http.delete('/api/schemas/' + id)
    		.then(parseData)
    	}
    }
});
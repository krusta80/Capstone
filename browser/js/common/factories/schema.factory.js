app.factory('SchemaFactory', function ($http) {
    var parseData = function(res) {
    	return res.data;
    };

    return {
    	fetchByAppId: function(appId) {
    		$http.get('/api/schemas/byApp/' + appId)
    		.then(parseData)
    	},
    	fetchById: function(id) {
    		$http.get('/api/schemas/' + id)
    		.then(parseData)
    	},
    	create: function(schema) {
    		$http.post('/api/schemas', schema)
    		.then(parseData)
    	},
    	update: function(schema) {
    		$http.put('/api/schemas/' + schema._id, schema)
    		.then(parseData)
    	},
    	remove: function(id) {
    		$http.delete('/api/schemas/' + id)
    		.then(parseData)
    	}
    }
});
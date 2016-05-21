app.factory('FieldFactory', function ($http) {
    var parseData = function(res) {
    	return res.data;
    };

    return {
    	fetchBySchemaId: function(schemaId) {
    		$http.get('/api/fields/bySchema/' + schemaId)
    		.then(parseData)
    	},
    	fetchById: function(id) {
    		$http.get('/api/fields/' + id)
    		.then(parseData)
    	},
    	create: function(field) {
    		$http.post('/api/fields', field)
    		.then(parseData)
    	},
    	update: function(field) {
    		$http.put('/api/fields/' + field._id, field)
    		.then(parseData)
    	},
    	remove: function(id) {
    		$http.delete('/api/fields/' + id)
    		.then(parseData)
    	}
    }
});
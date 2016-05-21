app.factory('FieldFactory', function ($http) {
    var parseData = function(res) {
    	return res.data;
    };

    return {
    	fetchBySchemaId: function(schemaId) {
    		return $http.get('/api/fields/bySchema/' + schemaId)
    		.then(parseData)
    	},
    	fetchById: function(id) {
    		return $http.get('/api/fields/' + id)
    		.then(parseData)
    	},
    	create: function(field) {
    		return $http.post('/api/fields', field)
    		.then(parseData)
    	},
    	update: function(field) {
    		return $http.put('/api/fields/' + field._id, field)
    		.then(parseData)
    	},
    	remove: function(id) {
    		return $http.delete('/api/fields/' + id)
    		.then(parseData)
    	}
    }
});
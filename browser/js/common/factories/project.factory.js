app.factory('ProjectFactory', function ($http) {
    var parseData = function(res) {
    	return res.data;
    };

    return {
    	fetchAll: function() {
    		return $http.get('/api/projects')
    		.then(parseData)
    	},
    	fetchById: function(id) {
    		return $http.get('/api/projects/' + id)
    		.then(parseData)
    	},
    	create: function(project) {
    		return $http.post('/api/projects', project)
    		.then(parseData)
    	},
    	update: function(project) {
    		return $http.put('/api/projects/' + project._id, project)
    		.then(parseData)
    	},
    	remove: function(id) {
    		return $http.delete('/api/projects/' + id)
    		.then(parseData)
    	}
    }
});
app.factory('ProjectFactory', function ($http) {
    var cacheData;
    var parseData = function(res) {
    	cacheData = res.data;
        return cacheData;
    };

    return {
    	fetchAll: function() {
    		return $http.get('/api/projects')
    		.then(parseData);
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
    	},
        findProjectIndex: function(projects, id) {
            for(var i = 0; i < projects.length; i++) {
                if(projects[i]._id === id)
                    return i;
            }
            return -1;
        },
        getCacheProjects: function() {
            return cacheData;
        }
    }
});

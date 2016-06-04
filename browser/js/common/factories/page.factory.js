app.factory('PageFactory', function ($http) {
    var parseData = function(res) {
    	return res.data;
    };

    return {
    	fetchByJobId: function(jobId) {
    		return $http.get('/api/pages/byJob/' + jobId)
    		.then(parseData)
    	},
    	fetchById: function(id) {
    		return $http.get('/api/pages/' + id)
    		.then(parseData)
    	},
    	create: function(page) {
    		return $http.post('/api/pages', page)
    		.then(parseData)
    	},
    	update: function(page) {
    		return $http.put('/api/pages/' + page._id, page)
    		.then(parseData)
    	},
    	remove: function(id) {
    		return $http.delete('/api/pages/' + id)
    		.then(parseData)
    	},
        getTypes: function() {
            return $http.get('/api/pages/pageTypes')
            .then(parseData)
        }
    }
});
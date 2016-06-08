app.factory('JobFactory', function ($http) {
    var parseData = function(res) {
    	return res.data;
    };

    return {
    	fetchByProjectId: function(projectId) {
    		return $http.get('/api/projects/' + projectId)
    		.then(function(res) {
                return res.data.jobs;
            })
    	},
    	fetchById: function(id) {
    		return $http.get('/api/jobs/' + id)
    		.then(parseData)
    	},
    	create: function(job) {
    		return $http.post('/api/jobs', job)
    		.then(parseData)
    	},
    	update: function(job) {
            return $http.put('/api/jobs/' + job._id, job)
    		.then(parseData)
    	},
    	remove: function(id) {
    		return $http.delete('/api/jobs/' + id)
    		.then(parseData)
    	},
        runJob: function(projectId, jobIndex) {
            return $http.post('/api/projects/' + projectId + '/job/' + jobIndex + '/run')
            .then(parseData)
        },
        findJobIndex: function(jobs, id) {
            for(var i = 0; i < jobs.length; i++) {
                if(jobs[i]._id === id)
                    return i;
            }
            return -1;
        }
    }
});
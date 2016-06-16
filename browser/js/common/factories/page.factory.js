app.factory('PageFactory', function ($http) {
    var parseData = function(res) {
        if (res.data.targetElements) {
            return jsonifyData(res.data);
        }
        return res.data;
    };
    var jsonifyData = function(data) {
        data.targetElements.forEach(function(targetElement) {
            if (typeof targetElement.fields === "string") {
                targetElement.fields = JSON.parse(targetElement.fields);
            }
        });
        return data;
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
            page.targetElements.forEach(function(targetElement) {
                if (typeof targetElement.fields != "string") {
                    targetElement.fields = JSON.stringify(targetElement.fields);
                }
            });
    		return $http.put('/api/pages/' + page._id, page)
    		.then(parseData)
    	},
    	remove: function(id) {
            console.log("heres delete id: ", id);
    		return $http.delete('/api/pages/' + id)
    		.then(parseData)
    	},
        getTypes: function() {
            return $http.get('/api/pages/pageTypes')
            .then(parseData)
        }
    }
});

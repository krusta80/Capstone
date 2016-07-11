app.factory('PageFactory', function ($http) {
    var parseData = function(res) {
        if (res.data.targetElements) {
            return jsonifyData(res.data);
        }
        return res.data;
    };
    var jsonifyData = function(data) {
        data.targetElements = data.targetElements.map(function(targetElement) {
            if (typeof targetElement.fields === "string") {

                targetElement.fields = JSON.parse(targetElement.fields);
            }
            return targetElement;
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
            page.targetElements = page.targetElements.map(function(targetElement) {
                if (typeof targetElement.fields != "string") {
                    targetElement.fields = JSON.stringify(targetElement.fields);
                }
                return targetElement;
            });
    		return $http.put('/api/pages/' + page._id, page).then(parseData);
    	},
        updateURL: function(page) {
            return $http.put('/api/pages/' + page._id, page.url).then(parseData);
        },
    	remove: function(id) {
            console.log("heres delete id: ", id);
    		return $http.delete('/api/pages/' + id)
    		.then(parseData)
    	},
        removeByJob: function(jobId){
            return $http.delete('/api/pages/byJob/'+ jobId);
        },
        getTypes: function() {
            return $http.get('/api/pages/pageTypes')
            .then(parseData)
        }
    }
});

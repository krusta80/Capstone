'use strict';
var router = require('express').Router();
const fs = require('fs');
var Promise = require('bluebird');
module.exports = router;

Promise.promisify(fs.readdir)(__dirname)
.then(function(fileList){
	fileList.forEach(router.addProjectRoute)
});

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});

router.addProjectRoute = function(fileName) {
	try {
		if(fs.statSync(__dirname + '/' + fileName).isDirectory()) {
			router.use('/'+fileName, require('./'+fileName));
			console.log("adding project subdirectory:", fileName);	
		}	
	}
	catch(err) {
		console.log("Error trying to add project as route:", err);
	}
};
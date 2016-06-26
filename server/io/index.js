'use strict';
var mongoose = require('mongoose');
var models = require('../db')
var Job = mongoose.model('Job');
var Project = mongoose.model('Project');
var socketio = require('socket.io');
var io = null;
var socketHash = {};

module.exports = function (server) {

    if (io) return io;

    io = socketio(server);

    io.on('connection', function (socket) {
        // Now have access to socket, wowzers!
        console.log("socket.io connection detected!");
        socketHash[socket.id] = {socket: socket};
        socket.emit('acknowledged', {id: socket.id});

		socket.on('jobInfo', function(info) {
			socketHash[socket.id].projectId = info.projectId;
			socketHash[socket.id].jobId = info.jobId;
      socketHash[socket.id].userId = info.userId;
			console.log(info);
		});

        socket.on('disconnect', function() {
			delete socketHash[socket.id];
			console.log("Deleted socket (", socket.id, ")");
		});
    });
    var wasRunning = {};
    setInterval(function() {
    	console.log(Object.keys(socketHash));
    	Project.find()
		.then(function(projects) {
			projects.forEach(function(project) {
				Object.keys(socketHash).forEach(function(socketId) {
					var socket = socketHash[socketId];
					console.log("socket.id is", socketId);
					console.log("socket.projectId is", socket.userId);
					console.log("project._id is", project.user);
					if(socket.userId == project.user) {
						//console.log("project id match")
						project.jobs.forEach(function(job) {
                var isComplete = false;
                if (!job.isRunning && wasRunning[job._id])
                  isComplete = true;
                wasRunning[job._id] = job.isRunning;
                var message = null;

                if (isComplete)
                  message = 'job ' + job.title + ' of project ' + project.title + ' was completed at ' + new Date(Date.now()).toLocaleTimeString('en-US');
								socket.socket.emit('jobUpdate', {projectId: project._id, jobId: job._id, isRunning: job.isRunning, isComplete: isComplete, message: message });
						});
					}
				});
			});
		});
    }, 15000);

    return io;

};

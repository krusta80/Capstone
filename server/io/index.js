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
			console.log(info);
		});
		
        socket.on('disconnect', function() {
			delete socketHash[socket.id];
			console.log("Deleted socket (", socket.id, ")");
		});
    });

    setInterval(function() {
    	console.log(Object.keys(socketHash));
    	Project.find({})
		.then(function(projects) {
			projects.forEach(function(project) {
				Object.keys(socketHash).forEach(function(socketId) {
					var socket = socketHash[socketId];
					//console.log("socket.id is", socketId);
					//console.log("socket.projectId is", socket.projectId);
					//console.log("project._id is", project._id);
					if(socket.projectId == project._id) {
						//console.log("project id match")
						project.jobs.forEach(function(job) {
							if(job._id == socket.jobId)
								socket.socket.emit('jobUpdate', {projectId: project._id, jobId: job._id, isRunning: job.isRunning});
						})
					}
				})
			})
		});
    }, 15000);
    
    return io;

};

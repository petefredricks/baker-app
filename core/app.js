"use strict";

var express = require('express');
var nconf = require('nconf');
var async = require('async');
var app = module.exports = express();
var assets = require('./lib/assets');


// Load environment configs
var env = process.env.NODE_ENV;
require('./config')(env);

var tasks = {
	initAssets: function(next) {

		assets.init(next);

	},
	setRoutes: function(next) {

		// Define the routes for the application
		app.use('/', require( './routes'));

		setImmediate(next);

	},
	startServer: function(next) {

		var port = nconf.get('server:port');

		// Listen for requests
		app.listen(port, function(){
			console.log('Listening on port ' + port );
			setImmediate(next);
		});

	}
};

// run all the tasks to start the server
async.series(tasks, function(err) {
	if (err) {
		console.error(err)
	}
});



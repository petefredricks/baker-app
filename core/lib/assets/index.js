"use strict";

var path = require('path');
var logger = require('morgan');
var express = require('express');
var nconf = require('nconf');
var assetWorker = require('asset-worker');
var app = require('../../app.js');
var pkg = require('../../../package.json');

module.exports = {
	init: init
};

function init(done) {

	// init assets
	var buildDir = path.join(__dirname, '../../.build');
	var clientDir = path.join(__dirname, '../../client');
	var optimized = nconf.get('app:optimized');

	assetWorker.setOptions({
		clientDir: clientDir,
		buildDir: buildDir,
		resourceRoot: nconf.get('app:resourceRoot'),
		optimized: optimized,
		appVersion: pkg.version
	});

	// set app variables
	app.set('clientDir', clientDir);
	app.set('views', path.join( __dirname, '../../views'));
	app.set('view engine', 'jade');

	// development only
	if (nconf.get('app:debug')) {
		// pretty html
		app.locals.pretty = true;
		app.use(logger('dev'));
	}

	// handing static assets
	app.use(express.static(buildDir));

	// only expose client directory if in development or debugging
	app.use( function( req, res, next ) {

		if (req.query['__scriptdebug__'] === 'true') {
			req.__debugFlag = true;
		}

		if (!optimized || req.__debugFlag) {
			express.static(clientDir).apply(this, arguments);
		}
		else {
			next();
		}
	});

	setImmediate(done);
}
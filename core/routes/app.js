"use strict";

var assetWorker = require('asset-worker');
var jadeConfig = require('../config/jade');

// ----- ROUTE FUNCTIONS ----- //

function appAction(req, res, next) {

	assetWorker.getPaths('app', req, function(err, paths) {

		if (err) {
			return next(err);
		}

		jadeConfig.paths = paths;

		res.render('index', jadeConfig);

	});

}

module.exports = function(router) {

	// all routes should return index.jade
	router.get('*', appAction);
};
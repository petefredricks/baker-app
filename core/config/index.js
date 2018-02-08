"use strict";

var path = require('path');
var nconf = require('nconf');
var pkg = require('../../package.json');

module.exports = function(env) {

	env = env || 'development';

	try {
		nconf.file('credentials', path.join('/opt/etc', env, pkg.name + '.json'));
		nconf.file('environment', path.join(__dirname, 'env', env + '.json'));
		nconf.file('default', path.join(__dirname, 'env/default.json'));
	}
	catch (e) {
		return null;
	}

	return nconf;

};

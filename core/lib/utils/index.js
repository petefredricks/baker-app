 "use strict";

var nconf = require('nconf');

module.exports = {
	createHost: createHost,
	value: value
};

function createHost(secure) {

	var host = [];
	var port = nconf.get('server:port');

	if (secure === 'undefined') {
		secure = nconf.get('server:secure');
	}

	host.push(secure ? 'https://' : 'http://');
	host.push(nconf.get('server:host'));

	if ((secure && port !== 443) || (!secure && port !== 80)) {
		host.push(':', port);
	}

	return host.join('');
}

function value(obj, path) {

	var paths = path.split('.');
	var len = paths.length;
	var current = obj;
	var i = 0;

	while (current && i < len) {
		current = current[ paths[ i ] ];
		i++;
	}

	return i === len ? current : undefined;
}
"use strict";

const nconf = require('nconf');
const env = process.env.NODE_ENV;

module.exports = {
	isProduction: env === 'production',
	platformUrl: nconf.get('app:platformUrl'),
	stripeKey: nconf.get('stripe:publicKey'),
	title: 'Resume Yeti'
};
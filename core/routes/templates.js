"use strict";

var fs = require('fs');
var path = require('path');
var app = require('../app');

function renderTemplate(req, res) {

  // replace .html extension with .jade
  // create full path to jade file
  var filePath = path.join(app.get('clientDir'), req.url.replace('.html', '.jade'));

	fs.exists(filePath, function(yes) {
		if (yes) {
			res.render(filePath, {
				hostname: app.get('hostname'),
				doctype:'html'
			});
		}
		else {
			res.status(404).send('Not a template');
		}
	});
}

module.exports = function(router) {

  router.get('/*.html', renderTemplate);

};
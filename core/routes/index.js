var express = require('express');
var router = express.Router();

require('./templates')(router);
require('./app')(router);

module.exports = router;
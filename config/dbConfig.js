'use strict';
var mongojs = require('mongojs');

var config = {
  db: 'mongodbfeatures',  
  host: 'localhost',
  user: '',
  ps: '',
  port: 27017
};

var port = (config.port.length > 0) ? ":" + config.port : '';
var login = (config.user.length > 0) ? config.user + ":" + config.pw + "@" : '';
var uristring =  "mongodb://" + login + config.host + port + "/" + config.db;

// Connect to Database
var db = mongojs(uristring);

module.exports = db;

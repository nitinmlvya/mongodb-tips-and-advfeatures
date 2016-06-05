var express = require('express');
var app = module.exports = express();
// var db = require('../../config/dbConfig');
var db = require('./config/dbConfig');

var PORT_NUMBER = 3000;

require('./routes/paging')(app);

// register the models
require('./models/paging')(db);
app.set('dbConn', db);

app.listen(PORT_NUMBER, function() {
  console.log('Server running on localhost:%s', PORT_NUMBER);
});

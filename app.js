var express = require('express');
var bodyParser = require("body-parser");
var app = module.exports = express();
var db = require('./config/dbConfig');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var PORT_NUMBER = 3000;

// register the routes
require('./routes/paging')(app);
require('./routes/bulkInsert')(app);
require('./routes/ttl')(app);
require('./routes/transaction')(app);

// register the models
require('./models/paging')(db);
require('./models/bulkInsert')(db);
require('./models/ttl')(db);
require('./models/accounts')(db);
require('./models/transaction')(db);

app.set('dbConn', db);

app.listen(PORT_NUMBER, function() {
  console.log('Server running on localhost:%s', PORT_NUMBER);
});

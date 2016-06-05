var express = require('express');
var app = module.exports = express();
var db = require('../../config/dbConfig');

var PORT_NUMBER = 3000;

// app.get('/', function(req, res){
//   res.send('<b>Welcome to the paging example.</b> <br>Please try url: /students/pageNumber</br>');
// });

// app.get('/students', function(req, res){
//   console.log('###### req: ', req.query);
//   res.send({success: true, msg: 'Need to implement this.'})
// });


// var routes = require('./routes/paging')(app);
require('./routes/paging')(app);
// app.use('/', routes);

// register the models
require('../../models/paging')(db);
app.set('dbConn', db);

app.listen(PORT_NUMBER, function() {
  console.log('Server running on localhost:%s', PORT_NUMBER);
});

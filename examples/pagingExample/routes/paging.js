module.exports = function(app) {
    var db = require('../../../config/dbConfig')

    app.get('/', function(req, res) {
      res.send('<b>Welcome to the paging example.</b> <br>Please try url: /students/pageNumber</br>');
    });

    app.get('/students', function(req, res){
      console.log('###### req: ', req.query);
      res.send({success: true, msg: 'Need to implement this.'})
    });
};

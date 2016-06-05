module.exports = function(app) {

  app.get('/ttl/insert', function(req, res) {
    app.get('dbConn').model('TTL').create({id: 1, expiresAt: new Date()}).
    then(function(result) {
      res.send({success: true});
    });
  });

  app.get('/ttl/get', function(req, res) {
    app.get('dbConn').model('TTL').find().lean().exec().
    then(function(records) {
      res.send(records);
    })
  });
};

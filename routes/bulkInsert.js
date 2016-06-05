module.exports = function(app) {

  app.get('/insert', function(req, res) {
    for (var i = 0; i < 100000; i++) {
      app.get('dbConn').model('Bulk').create({id: i});
    }
    res.send({success: true, msg: 'Inserted 100000 records in bulk collections.'});
  });

  app.get('/bulk', function(req, res) {
    var bulk = app.get('dbConn').model('Bulk').collection.initializeUnorderedBulkOp();
    for (var i = 0; i < 100000; i++) {
      bulk.insert({id:i});
    }
    bulk.execute(function(err, savedRecords) {
      if (err) {
        console.log('##### Error occured in bulk save');
        res.send({success: false, msg: 'Failure in bulk save.'});
      } else {
        console.log('##### savedRecords: ', savedRecords.nInserted);
        res.send({success: true, msg: 'Inserted 100000 records in bulk collections.'});
      }
    });
  });
};

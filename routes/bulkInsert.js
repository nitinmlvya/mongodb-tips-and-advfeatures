module.exports = function(app) {

  // GET request to insert the records via individual save call
  app.get('/insert', function(req, res) {
    var totalRecords = 100000;
    for (var i = 0; i < totalRecords; i++) {
      app.get('dbConn').model('Bulk').create({id: i});
    }
    res.send({success: true, msg: 'Inserted records count: ' + totalRecords});
  });

  // GET request to insert the records with a bulk operation
  app.get('/bulk', function(req, res) {
    var bulk = app.get('dbConn').model('Bulk').collection.initializeUnorderedBulkOp();
    var totalRecords = 100000;
    for (var i = 0; i < totalRecords; i++) {
      bulk.insert({id:i});
    }
    bulk.execute(function(err, savedRecords) {
      if (err) {
        console.log('##### Error occured in bulk save');
        res.send({success: false, msg: 'Failure in bulk save.'});
      } else {
        console.log('##### savedRecords: ', savedRecords.nInserted);
        res.send({success: true, msg: 'Inserted records count: ' + totalRecords});
      }
    });
  });
};

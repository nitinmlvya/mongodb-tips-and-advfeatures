'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function(dbConn) {
  var BulkInsert = new Schema({
    id: Number
  }, {
    versionKey: false,
    collection: 'bulk'
  });

  dbConn.model('Bulk', BulkInsert);
}

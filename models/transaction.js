'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function(dbConn) {
  var TransactionSchema = new Schema({
    source: String,
    destination: String,
    amount: String,
    state: String,
    lastModified: Date
  }, {
    versionKey: false,
    collection: 'transactions'
  });

  dbConn.model('Transactions', TransactionSchema);
}

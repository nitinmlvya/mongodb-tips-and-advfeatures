'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function(dbConn) {
  var AccountSchema = new Schema({
    _id: String,
    balance: Number,
    pendingTransactions: Array
  }, {
    versionKey: false,
    collection: 'accounts'
  });

  dbConn.model('Accounts', AccountSchema);
}

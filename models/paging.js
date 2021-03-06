'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function(dbConn) {
  var PagingSchema = new Schema({
    id: Number
  }, {
    versionKey: false,
    collection: 'paging'
  });

  dbConn.model('Paging', PagingSchema);
}

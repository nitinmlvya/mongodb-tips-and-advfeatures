'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function(dbConn) {
  var TTLSchema = new Schema({
    id: Number,
    expiresAt: Date // this will be used to expire the records
  }, {
    versionKey: false,
    collection: 'ttl'
  });

  TTLSchema.index({
    expiresAt: 1
  }, {
    expireAfterSeconds: 60
  });
  dbConn.model('TTL', TTLSchema);
}

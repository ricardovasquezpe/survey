var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bidSchema = new Schema({
  otp        : { type: Number, required: true},
  used       : { type: Boolean, required: true},
  created_at : Date,
  updated_at : Date
});

var Bid = mongoose.model('Otp', bidSchema);
module.exports = Bid;
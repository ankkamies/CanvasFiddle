var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fiddleSchema = new Schema({
  title: String,
  hash: String,
  created: { type: Date, default: Date.now },
  content: String
});

var Fiddle = mongoose.model('Fiddle', fiddleSchema);

module.exports = Fiddle;

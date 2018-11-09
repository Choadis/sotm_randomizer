var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var environmentSchema   = new Schema({
  name: String,
  type: String,
  set: String
});

module.exports = mongoose.model('Environment', environmentSchema);

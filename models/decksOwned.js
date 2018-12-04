var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var decksOwnedSchema   = new Schema({
  username: {
    type: String,
    required: true,
    unique: false
  } ,
  type: {
    type: String,
    required: true
  },
  decksOwned: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('DecksOwned', decksOwnedSchema);

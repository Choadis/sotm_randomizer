var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var decksOwnedSchema   = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  } ,
  deckName: {
    type: String,
    unique: true,
    required: true
  }
});

module.exports = mongoose.model('decksOwned', decksOwnedSchema);

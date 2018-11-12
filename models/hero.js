var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var heroSchema   = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  } ,
  type: {
    type: String,
    unique: true,
    required: true
  },
  set: {
    type: String,
    unique: true,
    required: true
  }
});

module.exports = mongoose.model('Hero', heroSchema);

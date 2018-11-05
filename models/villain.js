var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var villainSchema   = new Schema({
    name: String,
    type: String,
    set: String
});

module.exports = mongoose.model('Villain', villainSchema);

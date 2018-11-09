var express = require('express');        // call express
var app = express();                // define our app using express
var bodyParser = require('body-parser');
var path = require('path');
var hbs = require('express-handlebars');
var request = require("request");
var mongoose   = require('mongoose');
const router = express.Router();

var Villain     = require('../models/villain.js');

router.post('/', (req, res) => {

  var newVillain = new Villain({
    name: req.body.name,
    type: req.body.type,
    set: req.body.set
  });      // create a new instance of the villain model with the name set from the req

  console.log(newVillain);

  // save the villain and check for errors

  newVillain.save().then((doc) => {
    res.send(doc);
    console.log('Villain created');
  }, (e) => {
    res.status(400).send(e);
  });
});

router.get('/', (req, res) => {
  Villain.find(function(err, villains) {
    if (err)
    res.send(err);

    res.json(villains);
  });
});

module.exports = router;

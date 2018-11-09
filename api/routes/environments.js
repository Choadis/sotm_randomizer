var express = require('express');        // call express
var app = express();                // define our app using express
var bodyParser = require('body-parser');
var path = require('path');
var hbs = require('express-handlebars');
var request = require("request");
var mongoose   = require('mongoose');
const router = express.Router();

var Environment     = require('../models/environment.js');

router.post('/', (req, res) => {

  var newEnvironment = new Environment({
    name: req.body.name,
    type: req.body.type,
    set: req.body.set
  });

  console.log(newEnvironment);

  newEnvironment.save().then((doc) => {
    res.send(doc);
    console.log('Environment created');
  }, (e) => {
    res.status(400).send(e);
  });
});

router.get('/', (req, res) => {
  Environment.find(function(err, environments) {
    if (err)
    res.send(err);

    res.json(environments);
  });
});

module.exports = router;

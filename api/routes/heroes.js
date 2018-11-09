var express = require('express');        // call express
var app = express();                // define our app using express
var bodyParser = require('body-parser');
var path = require('path');
var hbs = require('express-handlebars');
var request = require("request");
var mongoose   = require('mongoose');
const router = express.Router();

var Hero     = require('../models/hero.js');

router.post('/', (req, res) => {

  var newHero = new Hero({
    name: req.body.name,
    type: req.body.type,
    set: req.body.set
  });      // create a new instance of the hero model with the name set from the req

  console.log(newHero);

  // save the hero and check for errors

  newHero.save().then((doc) => {
    res.send(doc);
    console.log('Hero created');
  }, (e) => {
    res.status(400).send(e);
  });
});

router.get('/', (req, res) => {
  Hero.find(function(err, heroes) {
    if (err)
    res.send(err);
    res.json(heroes);
  });
});

module.exports = router;

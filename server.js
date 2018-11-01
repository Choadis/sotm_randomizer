var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var reload = require('reload')

// configure app to use bodyParser()
// this will get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var Hero     = require('./models/hero.js');
var Villain     = require('./models/villain.js');
var Environment     = require('./models/environment.js');
var mongoose   = require('mongoose');

mongoose.connect("mongodb://localhost:27017/sotm_db"); // connect to the database

var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use((req, res, next) => {
  // do logging
  // console.log('Something is happening.');
  next(); // make sure it goes to the next routes and doesn't stop here
});

router.post('/hero', (req, res) => {

  var newHero = new Hero({
    name: req.body.name,
    type: req.body.type
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

router.get('/hero', (req, res) => {
  Hero.find(function(err, heroes) {
    if (err)
    res.send(err);

    res.json(heroes);
  });
});

router.post('/villain', (req, res) => {

  var newVillain = new Villain({
    name: req.body.name,
    type: req.body.type
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

router.get('/villain', (req, res) => {
  Villain.find(function(err, villains) {
    if (err)
    res.send(err);

    res.json(villains);
  });
});

router.post('/environment', (req, res) => {

  var newEnvironment = new Environment({
    name: req.body.name,
    type: req.body.type
  });

  console.log(newEnvironment);

  newEnvironment.save().then((doc) => {
    res.send(doc);
    console.log('Environment created');
  }, (e) => {
    res.status(400).send(e);
  });
});

router.get('/environment', (req, res) => {
  Environment.find(function(err, environments) {
    if (err)
    res.send(err);

    res.json(environments);
  });
});

app.use('/api', router);

// START THE SERVER
// =============================================================================
reload(app);

app.listen(port);
console.log('Magic happens on port ' + port);

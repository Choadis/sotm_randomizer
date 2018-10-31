var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var Hero     = require('./models/hero.js');
var mongoose   = require('mongoose');

mongoose.connect("mongodb://localhost:27017/sotm_db"); // connect to the database

// console.log(Hero.save());

var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
  // do logging
  // console.log('Something is happening.');
  next(); // make sure it goes to the next routes and doesn't stop here
});

// console.log(Hero.find().exec());

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

router.post('/hero', (req, res) => {

  // console.log('First step');
  var newHero = new Hero({
    name: req.body.name
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

app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

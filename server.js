var express = require('express');        // call express
var app = express();                // define our app using express
var bodyParser = require('body-parser');
var path = require('path');
var hbs = require('express-handlebars');

// set up view engine
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layout'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// configure app to use bodyParser()
// this will get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

var Hero     = require('./models/hero.js');
var Villain     = require('./models/villain.js');
var Environment     = require('./models/environment.js');
var mongoose   = require('mongoose');

// mongoose.connect("mongodb://localhost:27017/sotm_db", { useNewUrlParser: true }); // connect to the database
mongoose.connect("mongodb://Choadis:Stan02042013@ds143953.mlab.com:43953/sotm_db", { useNewUrlParser: true }); // connect to the database

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

router.get('/hero', (req, res) => {
  Hero.find(function(err, heroes) {
    if (err)
    res.send(err);

    console.log('hit');
    res.json(heroes);
  });
});

router.post('/villain', (req, res) => {

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

router.get('/environment', (req, res) => {
  Environment.find(function(err, environments) {
    if (err)
    res.send(err);

    res.json(environments);
  });
});

// non api routes begin here

app.get('/', (req, res) => {

  res.render('index', {} );

});

app.get('/heroes', (req, res) => {

  Hero.find({}, 'name -_id', function(err, heroes) {
    if (err)
    res.send(err);

    res.render('deckRender', { title: "Heroes", array: heroes } );
  });
});

app.get('/villains', (req, res) => {

  Villain.find({}, 'name -_id', function(err, villains) {
    if (err)
    res.send(err);

    res.render('deckRender', { title: "Villains", array: villains } );
  });
});

app.get('/environments', (req, res) => {

  Environment.find({}, 'name -_id', function(err, environments) {
    if (err)
    res.send(err);

    res.render('deckRender', { title: "Environments", array: environments } );
  });
});

app.use('/api', router);

// START THE SERVER
// =============================================================================

app.listen(port);
console.log('Magic happens on port ' + port);

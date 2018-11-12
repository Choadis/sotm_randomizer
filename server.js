var express = require('express');        // call express
var app = express();                // define our app using express
var bodyParser = require('body-parser');
var path = require('path');
var hbs = require('express-handlebars');
var request = require("request");
var mongoose   = require('mongoose');
var bcrypt = require('bcrypt');

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
var User = require('./models/user.js');

mongoose.connect("mongodb://Choadis:Stan02042013@ds143953.mlab.com:43953/sotm_db", { useNewUrlParser: true }); // connect to the database

var router = express.Router();  // get an instance of the express Router

app.use('/api', router);

// middleware to use for all requests
router.use((req, res, next) => {
  // do logging
  // console.log('Something is happening.');
  next(); // make sure it goes to the next routes and doesn't stop here
});

//use sessions for tracking logins
// app.use(session({
//   secret: 'work hard',
//   resave: true,
//   saveUninitialized: false
// }));

// api routes go here

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

router.post('/user', (req, res) => {

  User.find({ email: req.body.email })
  .exec()
  .then(user => {
    if (user.length >= 1){
      return res.status(409).json({
        message: "Email already exists"
      });
    } else {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err
          });
        } else {
          var userData = new User ({
            email: req.body.email,
            username: req.body.username,
            password: hash
          });
          userData
          .save()
          .then((doc) => {
            res.send(doc);
            res.status(201).json({
              message: "User created"
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            })
          })
        };
      });
    }
  })
  .catch(err => {
    console.log(err);
    es.status(500).json({
      error: err
    });
  });

});

router.delete('/user/:userID', (req, res, next) => {

  User.deleteOne({ _id: req.params.userID })
  .exec()
  .then(result => {
    res.status(200).json({ 
      message: "User deleted"
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });

});

// non api routes begin here

app.get('/', (req, res) => {

  res.render('index', {} );

});

app.get('/heroes', (req, res) => {

  var heroes = { method: 'GET',
  url: 'http://localhost:3000/api/hero',
  headers:
  { 'Postman-Token': '7fabb12b-c302-4477-b9dc-09b50a3519e5',
  'Cache-Control': 'no-cache',
  'Content-Type': 'application/x-www-form-urlencoded' } };

  request(heroes, function (error, response, body) {
    if (error) throw new Error(error);

    res.render('deckRender', { title: "Heroes", array: JSON.parse(body) } );
  });

});

app.get('/villains', (req, res) => {

  var villains = { method: 'GET',
  url: 'http://localhost:3000/api/villain',
  headers:
  { 'Postman-Token': '7fabb12b-c302-4477-b9dc-09b50a3519e5',
  'Cache-Control': 'no-cache',
  'Content-Type': 'application/x-www-form-urlencoded' } };

  request(villains, function (error, response, body) {
    if (error) throw new Error(error);


    res.render('deckRender', { title: "Villains", array: JSON.parse(body) } );
  });

});

app.get('/environments', (req, res) => {

  var environments = { method: 'GET',
  url: 'http://localhost:3000/api/environment',
  headers:
  { 'Postman-Token': '7fabb12b-c302-4477-b9dc-09b50a3519e5',
  'Cache-Control': 'no-cache',
  'Content-Type': 'application/x-www-form-urlencoded' } };

  request(environments, function (error, response, body) {
    if (error) throw new Error(error);


    res.render('deckRender', { title: "Environments", array: JSON.parse(body) } );
  });

});

app.get('/signup', (req, res, next) => {

  res.render('signup')

});

app.get('/login', (req, res, next) => {

  res.render('login')

});

// START THE SERVER
// =============================================================================

app.listen(port);
console.log('Magic happens on port ' + port);

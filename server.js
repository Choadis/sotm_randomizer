var express = require('express');        // call express
var app = express();                // define our app using express
var bodyParser = require('body-parser');
var path = require('path');
var hbs = require('express-handlebars');
var request = require("request");
var mongoose   = require('mongoose');
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var jwt_decode = require('jwt-decode');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');

app.use(express.static('public'));
app.use(cookieParser())

require('dotenv').config()

// set up view engine
// =============================================================================
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layout'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// configure app to use bodyParser()
// this will get the data from a POST
// =============================================================================

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev')); // log every request to the console

// variable configuration
// =============================================================================

var port = process.env.PORT || 3000;
var DB_USERNAME = process.env.DB_USERNAME;
var DB_PW = process.env.DB_PW;
var URL_VAR = 'http://localhost:3000/';
var JWT_KEY = process.env.JWT_KEY;

var Hero     = require('./models/hero.js');
var Villain     = require('./models/villain.js');
var Environment     = require('./models/environment.js');
var User = require('./models/user.js');
var DecksOwned = require('./models/decksOwned.js');

var heroArray = [];
var villainArray = [];
var envArray = [];

// database connection
// =============================================================================

mongoose.connect(`mongodb://${DB_USERNAME}:${DB_PW}@ds143953.mlab.com:43953/sotm_db`, { useNewUrlParser: true }); // connect to the database

// get instance of app and set router middleware
// =============================================================================

var router = express.Router();  // get an instance of the express Router

app.use('/api', router);

// api routes go here
// =============================================================================

router.post('/hero', (req, res) => {

  var newHero = new Hero({
    name: req.body.name,
    type: req.body.type,
    set: req.body.set
  });

  newHero.save().then((doc) => {
    res.send(doc);
    // console.log('Hero created');
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

  // console.log(newVillain);

  // save the villain and check for errors

  newVillain.save().then((doc) => {
    res.send(doc);
    // console.log('Villain created');
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

  // console.log(newEnvironment);

  newEnvironment.save().then((doc) => {
    res.send(doc);
    // console.log('Environment created');
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

router.post('/decksOwned', (req, res) => {

  var newdeckOwned = new DecksOwned({
    username: req.body.username,
    type: req.body.type,
    decksOwned: req.body.decksOwned
  });

  DecksOwned.find({username: req.body.username, type: req.body.type})
  .exec()
  .then(userDecks => {
    if (userDecks.length > 0) {
      var query = {username: req.body.username, type: req.body.type}
      // console.log(userDecks);
      DecksOwned.findOne(query, function (err, doc){
        doc.decksOwned = req.body.decksOwned;
        // doc.visits.$inc();
        console.log(doc);
        doc
        .save()
        .then((doc) => {
          res.send(doc)
        }, (e) => {
          res.status(400).send(e);
        });
      });
      // console.log(userDecks);
    } else {
      newdeckOwned
      .save()
      .then((doc) => {
        res.send(doc);
        console.log('Deck added');
      }, (e) => {
        res.status(400).send(e);
      });
    }
  });
});

router.get('/decksOwned', (req, res) => {
  DecksOwned.find(function(err, decksOwned) {
    if (err)
    res.send(err);
    res.json(decksOwned);
  });
});

router.get('/decksOwned/:username/:type', (req, res) => {

  DecksOwned.find({username: req.params.username, type: req.params.type})
  .exec()
  .then(doc => {
    res.json(doc)
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });

});

router.post('/user', (req, res) => {

  // console.log(req.body);

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
    res.status(500).json({
      error: err
    });
  });

});

router.delete('/user/:username', (req, res, next) => {

  User.deleteOne({ username: req.params.username })
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

router.post('/login', (req, res, next) => {

  User.findOne( {username: req.body.username} )
  .exec()
  .then(user => {
    if (user.length < 1){
      return res.status(401).json({
        message: "Authentication failed"
      })
    }
    bcrypt.compare(req.body.password, user.password, (err, result) => {

      if (err) {
        return res.status(401)
        messageFail = "I can\'t let you do that Fox";
      } if (result) {
        const token = jwt.sign({
          email: user.email,
          username: user.username,
          admin: user.admin
        },
        JWT_KEY,
        {expiresIn: "1h"});

        // res.set('authorization', `Bearer ${token}`)
        res.cookie('authorization', token,  {maxAge: 3600000})

        return res.status(200).json({
          message: "Auth successful",
          token: token
        });
      }
      return res.status(401)
      messageFail = "I can\'t let you do that Fox";
    })
  })
  .catch(err => {
    // console.log(err);
    res.status(500).redirect('/login')
    messageFail = 'Something was wrong with that...'
  });

});

// non api routes begin here
// =============================================================================

app.get('/', (req, res, next) => {

  console.log(req.headers.cookie);

  if (req.headers.cookie) {
    cookie = parseCookie(req.headers.cookie)
  } else {
    cookie = undefined
  }

  if (cookie == undefined || cookie['logged_in'] == false) {
    res.render('index')
  } else {
    res.render('index', { username: cookie['username']})
  }

  // if (cookie['authorization'] !== false) {
  //   res.render('index', { username: cookie['username']})
  // } else {
  //   res.render('index');
  // }

});

app.get('/heroes', (req, res) => {

  var heroes = { method: 'GET',
  url: `${URL_VAR}api/hero`,
  headers:
  {'Cache-Control': 'no-cache',
  'Content-Type': 'application/x-www-form-urlencoded' } };

  request(heroes, function (error, response, body) {
    if (error) throw new Error(error);
    // console.log(body);

    res.render('deckRender', { title: "Heroes", array: JSON.parse(body) } );
  });

});

app.get('/villains', (req, res) => {

  var villains = { method: 'GET',
  url: `${URL_VAR}api/villain`,
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
  url: `${URL_VAR}api/environment`,
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

  if (typeof messageFail !== 'undefined') {
    res.render('login', { messageFail: messageFail })
  } else {
    res.render('login')
  }

});

app.get('/addNewHero', verifyToken, (req, res,) => {

  cookie = parseCookie(req.headers.cookie);

  if (cookie['admin'] !== undefined){
    res.render('newDeckForm', {type: 'hero'})
  } else {
    messageFail = 'Admins only my dude'
    res.render('login', {messageFail: messageFail})
  }

});

app.get('/addNewVillain', verifyToken, (req, res,) => {

  cookie = parseCookie(req.headers.cookie);

  if (cookie['admin'] !== undefined){
    res.render('newDeckForm', {type: 'villain'})
  } else {
    messageFail = 'Admins only my dude'
    res.render('login', {messageFail: messageFail})
  }

});

app.get('/addNewEnv', verifyToken, (req, res,) => {

  cookie = parseCookie(req.headers.cookie);

  if (cookie['admin'] !== undefined){
    res.render('newDeckForm', {type: 'environment'})
  } else {
    messageFail = 'Admins only my dude'
    res.render('login', {messageFail: messageFail})
  }

});

app.get('/:username/profile', verifyToken, (req,res) => {

  cookie = parseCookie(req.headers.cookie);

  if (typeof messageOK !== 'undefined' && cookie['admin'] == undefined) {
    res.render('profile', { messageOK: messageOK, username: cookie['username'] });
  } if (cookie['admin'] !== undefined) {

    var decksOwned = { method: 'GET',
    url: `${URL_VAR}api/decksOwned/`,
    headers:
    {'Cache-Control': 'no-cache',
    'Content-Type': 'application/x-www-form-urlencoded' } };

    request(decksOwned, function (error, response, body) {
      if (error) throw new Error(error);
      // console.log(JSON.parse(body));

      res.render('adminPage', { username: cookie['username'], array: JSON.parse(body) } );
    });

    // res.render('adminPage', { username: cookie['username']})
  }  else {
    res.render('profile', { username: cookie['username'] });
  }

});

app.get('/:username/heroForm', verifyToken, (req, res) => {

  // var username = req.authData['username']

  var heroes = { method: 'GET',
  url: `${URL_VAR}api/hero`,
  headers:
  { 'Postman-Token': '7fabb12b-c302-4477-b9dc-09b50a3519e5',
  'Cache-Control': 'no-cache',
  'Content-Type': 'application/x-www-form-urlencoded' } };

  request(heroes, function (error, response, body) {
    if (error) throw new Error(error);

    res.render('deckForm', { type: 'hero', array: JSON.parse(body), username: req.authData.username } );
  });

});

app.get('/:username/villainForm', verifyToken, (req, res) => {

  // var username = req.authData['username']

  var villains = { method: 'GET',
  url: `${URL_VAR}api/villain`,
  headers:
  { 'Postman-Token': '7fabb12b-c302-4477-b9dc-09b50a3519e5',
  'Cache-Control': 'no-cache',
  'Content-Type': 'application/x-www-form-urlencoded' } };

  request(villains, function (error, response, body) {
    if (error) throw new Error(error);

    res.render('deckForm', { type: 'villain', array: JSON.parse(body), username: req.authData.username } );
  });

});

app.get('/:username/envForm', verifyToken, (req, res) => {

  // var username = req.authData['username']

  var environments = { method: 'GET',
  url: `${URL_VAR}api/environment`,
  headers:
  { 'Postman-Token': '7fabb12b-c302-4477-b9dc-09b50a3519e5',
  'Cache-Control': 'no-cache',
  'Content-Type': 'application/x-www-form-urlencoded' } };

  request(environments, function (error, response, body) {
    if (error) throw new Error(error);

    res.render('deckForm', { type: 'environment', array: JSON.parse(body), username: req.authData.username } );
  });

});

app.get('/randomizer', (req, res) => {

  res.render('randomizer')

});

// Middleware Functions go here
// =============================================================================

function verifyToken(req, res, next) {

  // Get auth header value
  const bearerHeader = req.headers.cookie;
  // console.log(bearerHeader);

  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {

    // parse out auth data from cookie
    var bearer = bearerHeader.split('authorization=');
    bearer = String(bearer[1].split(';'))
    req.token = bearer;

    jwt.verify(req.token, JWT_KEY, (err, authData) => {
      if(err) {
        res.sendStatus(403);
        messageFail = 'Somethin ain\'t right'
        res.redirect('/login', {messageFail: messageFail})
      } else {
        messageOK = 'You\'re logged in now'
        req.authData = authData;
        next();
      }
    })
  } else {
    messageFail = "I can\'t let you do that, Fox";
    res.redirect('/login')
  }

}

// Helper Functions
// =============================================================================

function parseCookie(cookie) {

  cookieSplit = cookie.split('authorization=');
  cookieSplit2 = String(cookieSplit[1].split(';'))
  cookie = jwt_decode(cookieSplit2)
  return cookie;

}

// START THE SERVER
// =============================================================================

app.listen(port);
console.log('Magic happens on port ' + port);

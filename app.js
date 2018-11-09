var express = require('express');        // call express
var app = express();                // define our app using express
var bodyParser = require('body-parser');
var path = require('path');
var hbs = require('express-handlebars');
var request = require("request");
var mongoose   = require('mongoose');

// set up view engine
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layout'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

var heroAPI     = require('./api/routes/heroes.js');
var villainAPI     = require('./api/routes/villains.js');
var envAPI     = require('./api/routes/environments.js');
var userAPI     = require('./api/routes/users.js');
var heroRender = require('./frontend/routes/heroes.js');
var villainRender = require('./frontend/routes/villains.js');
var envRender = require('./frontend/routes/environments.js');

mongoose.connect("mongodb://Choadis:Stan02042013@ds143953.mlab.com:43953/sotm_db", { useNewUrlParser: true }); // connect to the database

var router = express.Router();  // get an instance of the express Router

app.use('/api', router);

// configure app to use bodyParser()
// this will get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes which should handle requests
router.use("/heroes", heroAPI);
router.use("/villains", villainAPI);
router.use("/environments", envAPI);
router.use("/users", userAPI);
app.use('/heroes', heroRender)
app.use('/villains', villainRender)
app.use('/environments', envRender)

app.get('/', (req, res) => {

  res.render('index', {} );

});

app.get('/signup', (req, res, next) => {

  res.render('signup')

});

app.get('/login', (req, res, next) => {

  res.render('login')

});

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;

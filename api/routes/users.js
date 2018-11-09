var express = require('express');        // call express
var app = express();                // define our app using express
var bodyParser = require('body-parser');
var path = require('path');
var hbs = require('express-handlebars');
var request = require("request");
var mongoose   = require('mongoose');
const router = express.Router();

var User     = require('../models/user.js');

router.post('/', (req, res) => {

  var userData = new User ({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });

  console.log(userData);

  //use schema.create to insert data into the db
  userData.save().then((doc) => {
    res.send(doc);
    return res.redirect('/');
  }, (e) => {
    res.status(400).send(e);
  });

});

module.exports = router;

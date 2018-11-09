var express = require('express');        // call express
var app = express();                // define our app using express
var bodyParser = require('body-parser');
var path = require('path');
var hbs = require('express-handlebars');
var request = require("request");
var mongoose   = require('mongoose');
const router = express.Router();

app.get('/', (req, res) => {

  var villains = { method: 'GET',
  url: 'http://localhost:3000/api/villains',
  headers:
  { 'Postman-Token': '7fabb12b-c302-4477-b9dc-09b50a3519e5',
  'Cache-Control': 'no-cache',
  'Content-Type': 'application/x-www-form-urlencoded' } };

  request(villains, function (error, response, body) {
    if (error) throw new Error(error);


    res.render('deckRender', { title: "Villains", array: JSON.parse(body) } );
  });

});

module.exports = app;

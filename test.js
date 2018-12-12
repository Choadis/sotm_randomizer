// Config Variables
// =============================================================================
var request = require("request");

var URL_VAR = 'https://sotm-randomizer.herokuapp.com/';

var Hero     = require('./models/hero.js');
var Villain     = require('./models/villain.js');
var Environment     = require('./models/environment.js');
var User = require('./models/user.js');
var DecksOwned = require('./models/decksOwned.js');
var apiRes = []

// Helper Functions
// =============================================================================

// call api funtion by Caleb Mahala @ https://github.com/calebgmahala
function callApi(a, b='GET') {
  var resp = ''
  return new Promise(function(resolve, reject){
    request({url: URL_VAR + 'api/' + a, method: b}, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(body)
      } else if (response.statusCode == 404) {
        resolve(null)
      } else {
        reject(Error(error + " | " + response + " | " + body))
      }
    })
  })
}

const DEF_DELAY = 1000;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms || DEF_DELAY));
}

// The tests
// =============================================================================

function testHeroEndpoint() {

  callApi('hero')
  .then(doc => {
    if (doc !== null) {
      // apiRes.push('1')
      console.log('Hero API Pass');
    } else {
      // return false
      console.log('Hero API FAIL');
    }
  })
  .catch(err => {
    console.log(err);
  })

};

function testVillainEndpoint() {

  callApi('villain')
  .then(doc => {
    if (doc !== null) {
      // apiRes.push('2')
      console.log('Villain API pass');
    } else {
      // return false
      console.log('Villain API FAIL');
    }
  })
  .catch(err => {
    console.log(err);
  })

};

function testEnvEndpoint() {

  callApi('environment')
  .then(doc => {
    if (doc !== null) {
      // apiRes.push('3')
      console.log('Env API pass');
    } else {
      // return false
      console.log('Env API FAIL');
    }
  })
  .catch(err => {
    console.log(err);
  })

};

function testGetDecksOwned() {

  callApi('decksOwned')
  .then(doc => {
    if (doc !== null) {
      // apiRes.push('4')
      console.log('Decks API pass');
    } else {
      // return false
      console.log('Decks API FAIL');
    }
  })
  .catch(err => {
    console.log(err);
  })

};

function testNewUser() {

  var options = { method: 'POST',
  url: URL_VAR + 'api/user',
  headers:
  { 'cache-control': 'no-cache',
  'Content-Type': 'application/x-www-form-urlencoded' },
  form: { email: 'test@test.com', username: 'test', password: 'test' } };

  return new Promise(function (resolve, reject){
    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      resolve(body);
    });
  })
  .then(doc => {
    if (doc !== '{"message":"User created"}') {
      console.log('Create user test FAIL');
      // console.log(response);
    } else {
      console.log('Create user test pass');
    }
  })

};

function testLogin() {

  var options = { method: 'POST',
  url: 'https://sotm-randomizer.herokuapp.com/api/login',
  headers:
  {'cache-control': 'no-cache',
  'Content-Type': 'application/x-www-form-urlencoded' },
  form:
  { email: 'choadis@gmail.com',
  username: 'Choadis',
  password: 'Stan2413' } };

  return new Promise(function (resolve, reject){
    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      resolve(body)
    });
  })
  .then(doc =>{
    var pass = doc.split(':')
    var pass2 = pass[1].split(',')
    if (pass2[0] == '"Auth successful"'){
      console.log('Login test pass');
    } else {
      console.log('Login test FAIL');
    }
  })

};

function testDeleteUser() {

  var options = { method: 'DELETE',
  url: URL_VAR + 'api/user/test',
  headers:
  { 'cache-control': 'no-cache' } };

  return new Promise(function (resolve, reject){
    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      resolve(body);
    });
  })
  .then(doc => {
    if (doc !== '{"message":"User deleted"}') {
      console.log('Delete user test FAIL');
      // console.log(response);
    } else {
      console.log('Delete user test pass');
    }
  })

};

function apiTests() {
  console.log('API tests:');
  console.log('-----------------------------------------');
  testHeroEndpoint()
  testVillainEndpoint()
  testEnvEndpoint()
  testGetDecksOwned()
};

async function userTests() {
  console.log('User Tests:');
  console.log('-----------------------------------------');
  await testNewUser();
  await testLogin();
  await testDeleteUser();
};

async function runTests(){
  apiTests();
  await sleep(1000)
  console.log('\n');
  userTests();
}

runTests();

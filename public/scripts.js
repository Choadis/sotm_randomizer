// Helper Functions
// =============================================================================

// Sauce: https://stackoverflow.com/questions/7215547/how-to-update-and-delete-a-cookie

function createCookie(name,value,days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 *1000));
    var expires = "; expires=" + date.toGMTString();
  } else {
    var expires = "";
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') {
      c = c.substring(1,c.length);
    }
    if (c.indexOf(nameEQ) == 0) {
      return c.substring(nameEQ.length,c.length);
    }
  }
  return null;
}

function eraseCookie(name) {
  createCookie(name,"",-1);
}

function parseCookie(cookie) {

  cookieSplit = cookie.split('authorization=');
  cookieSplit2 = String(cookieSplit[1].split(';'))
  cookie = jwt_decode(cookieSplit2)
  return cookie;

}

// Sauce: https://stackoverflow.com/questions/8563240/how-to-get-all-checked-checkboxes

// Pass the checkbox name to the function
function getCheckedBoxes(chkboxName) {
  var checkboxes = document.querySelectorAll('[data-name]');;
  // console.log(checkboxes);
  var checkboxesChecked = [];
  // loop over them all
  for (var i=0; i<checkboxes.length; i++) {
    // And stick the checked ones onto an array...
    if (checkboxes[i].checked) {
      checkboxesChecked.push(checkboxes[i].id);
      // console.log(checkboxesChecked);
    }
  }
  // Return the array
  // console.log(checkboxesChecked);
  return checkboxesChecked;
}

function rng(array, number) {

  randomArray = [];

  for (i = 0; i < number; i++) {

    var index = Math.floor(Math.random() * array.length);
    var randomDeck = array[index];

    randomArray.push(randomDeck['name']);
    array.splice(index, 1)
    // console.log(array);

  }

  // console.log(randomArray);
  return randomArray.sort()

}

function rngLoggedIn(array, number) {

  randomArray = [];

  for (i = 0; i < number; i++) {

    var index = Math.floor(Math.random() * array.length);
    var randomDeck = array[index];

    randomArray.push(randomDeck);
    array.splice(index, 1)
    console.log(array);

  }
}

// Handlers
// =============================================================================

$(document).ready(function() {

  var URL_VAR = 'https://sotm-randomizer.herokuapp.com/';

  $("#submitNewUser").click(function(event) {

    data = {
      email: $('#email').val(),
      username: $('#username').val(),
      password: $('#password').val()
    };

    console.log(data);
    event.preventDefault();
    $.post({
      url: URL_VAR + 'api/user',
      data: data,
      success: function(data) {
        alert('New User created~ Feel free to log in and view your profile page')
        // messageOK = 'New User created~ Feel free to log in and view your profile page'
        window.location.replace(URL_VAR);
      }
    });
  });

  $("#submitLogin").click(function(event) {

    data = {
      username: $('#username').val(),
      password: $('#password').val()
    };

    event.preventDefault();
    $.post({
      url: URL_VAR + 'api/login',
      data: data,
      success: function(notData) {
        window.location.replace(URL_VAR + data.username + '/profile');
      }
    });
  });

  $("#logout").click(function(event) {
    eraseCookie('authorization')
    alert('Logout successful')
    window.location.replace(URL_VAR);
    console.log(document.cookie);
  })

  $('#submitDeckForm').click(function(event) {

    checkedBoxes = getCheckedBoxes('deckName');

    data = {
      username: parseCookie(document.cookie)['username'],
      type: $('#deckType').val(),
      decksOwned: JSON.stringify(checkedBoxes)
    }

    console.log(data);
    event.preventDefault();
    $.post({
      url: URL_VAR + 'api/decksOwned',
      data: data,
      success: function(notData) {
        alert('Decks updated')
        window.location.replace(URL_VAR + data.username + '/profile');
      }
    });

  })

  $('#submitSelectorForm').click(function(event) {

    event.preventDefault();
    $('.card').removeClass('d-none')
    // $('#villainBox').removeClass('d-none')
    // $('#envBox').removeClass('d-none')

    var randomHero = $('#heroSelector').val()
    var randomVillain = $('#villainSelector').val()
    var randomEnv = $('#envSelector').val()

    var token = readCookie('authorization');
    // console.log(token);

    if (token !== null){
      var cookie = jwt_decode(token);
    } else {
      cookie = null;
    }

    // console.log(cookie);

    if (cookie !== null) {

      heroes = $.get({
        url: '/api/decksOwned/' + cookie['username'] + '/hero',
        success: function (data) {
          randomHeroes = rngLoggedIn(data['decksOwned'], randomHero)
          for (i = 0; i < randomHeroes.length; i++) {
            $('#heroBox').append("<li class=\"list-group-item mb-1\">" + randomHeroes[i] + "<li>")
          }
        }
      })

      villains = $.get({
        url: '/api/decksOwned/' + cookie['username'] + '/villain',
        success: function (data) {
          randomVillains = rngLoggedIn(data['decksOwned'], randomVillain)
          for (i = 0; i < randomVillains.length; i++) {
            $('#villainBox').append("<li class=\"list-group-item mb-1\">" + randomVillains[i] + "<li>")
          }
        }
      })

      env = $.get({
        url: '/api/decksOwned/' + cookie['username'] + '/environment',
        success: function (data) {
          randomEnvs = rngLoggedIn(data['decksOwned'], randomEnv)
          for (i = 0; i < randomEnvs.length; i++) {
            $('#envBox').append("<li class=\"list-group-item mb-1\">" + randomEnvs[i] + "<li>")
          }
        }
      })

    } else {

      heroes = $.get({
        url: '/api/hero',
        success: function (data) {
          randomHeroes = rng(data, randomHero)
          for (i = 0; i < randomHeroes.length; i++) {
            $('#heroBox').append("<li class=\"list-group-item mb-1\">" + randomHeroes[i] + "<li>")
          }
        }
      })

      villains = $.get({
        url: '/api/villain',
        success: function (data) {
          randomVillains = rng(data, randomVillain)
          for (i = 0; i < randomVillains.length; i++) {
            $('#villainBox').append("<li class=\"list-group-item mb-1\">" + randomVillains[i] + "<li>")
          }
        }
      })

      env = $.get({
        url: '/api/environment',
        success: function (data) {
          randomEnvs = rng(data, randomEnv)
          for (i = 0; i < randomEnvs.length; i++) {
            $('#envBox').append("<li class=\"list-group-item mb-1\">" + randomEnvs[i] + "<li>")
          }
        }
      })

    }
  })

});

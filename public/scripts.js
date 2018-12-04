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


// Handlers
// =============================================================================

$(document).ready(function() {

  var URL_VAR = 'http://localhost:3000/';

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

});

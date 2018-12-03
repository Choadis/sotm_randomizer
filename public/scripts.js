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
    alert('Logout successful, close this browser window to finalize it')
    // res.setCookie('authorization', '', 0)
    window.location.replace(URL_VAR);
    console.log(document.cookie);
    // cookies.set('authorization', {expires: new Date(0)})
    // console.log($.cookie);
  })

  // $("#submitDeckForm").submit(function(event) {
  //
  //   data = {
  //     deckType: $('#deckType').val();
  //   }
  //
  //   console.log(data);
  //
  //   // $('.form-thing:checked'){
  //   //   console.log(this);
  //   // }
  //
  //
  //   // var form = $(this);
  //   // event.preventDefault();
  //   // console.log(form.serialize());`
  //   // $.ajax({
  //   //   type: "POST",
  //   //   url: URL_VAR + "/api/decksOwned",
  //   //   data: form.serialize(), // serializes the form's elements.
  //   //   success: function(res) {
  //   //     window.location.replace("/profile");
  //   //   }
  //   // });
  // });

});

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

  $("#heroForm").submit(function(event) {
    var form = $(this);
    event.preventDefault();
    $.ajax({
      type: "POST",
      url: URL_VAR + "/api/decksOwned",
      data: form.serialize(), // serializes the form's elements.
      success: function(res) {
        window.location.replace("/profile");
      }
    });
  });

});

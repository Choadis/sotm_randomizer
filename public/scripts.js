$(document).ready(function() {

  $("#submitNewUser").click(function(event) {

    data = {
      email: $('#email').val(),
      username: $('#username').val(),
      password: $('#password').val()
    };

    console.log(data);
    event.preventDefault();
    $.post({
      url: `http://localhost:3000/api/user`,
      data: data,
      success: function(data) {
        alert('New User created~ Feel free to log in and view your profile page')
        window.location.replace(`http://localhost:3000/`);
      }
    });
  });

  $("#submitLogin").click(function(event) {

    data = {
      email: $('#email').val(),
      password: $('#password').val()
    };

    // console.log(data);
    event.preventDefault();
    $.post({
      url: `http://localhost:3000/api/login`,
      data: data,
      success: function(data) {
        alert('You should be logged in now?')
        window.location.replace(`http://localhost:3000/`);
      }
    });
  });

});

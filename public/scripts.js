$(document).ready(function() {

  $("#submitNewUser").click(function(event) {

    data = {
      email: $('#email').val(),
      username: $('#username').val(),
      password: $('#password').val()
    };

    console.log(data);
    // alert('This is an alert my dude')
    // var form = $('#signupForm');
    event.preventDefault();
    // console.log($('#email').val());
    $.post({
      url: `http://localhost:3000/api/user`,
      data: data,
      success: function(data) {
        alert('New User created~ Feel free to log in and view your profile page')
        window.location.replace(`http://localhost:3000/`);
      }
    });
  });

});

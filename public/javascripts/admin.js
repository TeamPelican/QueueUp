$(document).ready(function() {
  $('.checkbox').click(function() {

    var changeToAdmin = $(this).is(':checked');
    var username = $(this).attr('name');
    var checkbox = $(this);

    $.ajax({
      url: "http://localhost:3000/admin/changeAdmin",
      type: "POST",
      data: {
        username: username,
        changeToAdmin: changeToAdmin
      },
      cache: false,
      dataType: "json",
      success: function(data) {
        // place code here if we want to do something more with response from the server
      }
    });
  });
});

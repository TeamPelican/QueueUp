$(document).ready(function() {
  $('.checkbox').click(function() {

    var changeToAdmin = $(this).is(':checked');
    var username = $(this).attr('name');

    jQuery.ajax({
      url: "http://localhost:3000/admin/changeAdmin",
      type: "POST",
      data: {
        username: username,
        changeToAdmin: changeToAdmin
      },
      cache: false,
      dataType: "json"
    });
  });
});

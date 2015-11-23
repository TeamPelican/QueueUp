function showDialog(message, status) {
  // assume error if status left undefined
  var alertStatus = status || 'error';
  message = $('<div/>').html(message).text();
  swal(message, '', alertStatus);
}

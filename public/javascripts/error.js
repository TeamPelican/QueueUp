function errorMessageDialog(message) {
  message = $('<div/>').html(message).text();
  swal('Oops..', message, 'error');
}

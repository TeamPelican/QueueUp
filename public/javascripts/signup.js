$(document).ready(() => {
  $('.form-signup').on('submit', () => {
    if ($('#inputPassword').val() !== $('#inputPasswordConfirm').val()) {
      swal('Password mismatch!', 'Please make sure your passwords are matching.', 'error');
      return false;
    }
    return true;
  });
});

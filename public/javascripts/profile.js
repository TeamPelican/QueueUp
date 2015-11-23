$(document).ready(() => {
  $('.form-changepass').on('submit', () => {
    if ($('#inputNewPassword').val() !== $('#inputNewPassConfirm').val()) {
      swal('Password mismatch!', 'Please make sure your passwords are matching.', 'error');
      return false;
    }
    return true;
  });
});

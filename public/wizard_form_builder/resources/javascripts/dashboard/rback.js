$(document).ready(function(){
  $('#add_new_role').on('click', function(){
    $.fancybox($('#add_new_role_tmpl').html());
  });

  $("#pwd_change").click(function(e){
    e.preventDefault();
    $.fancybox($('#change_password').html());
  });

  $("#user_password_confirmation").live('keyup',
    function(){
      var el = $('#user_password'),
      el_confirm = $(this),
      error_div = $('#password_confirmation_msg');
      var password = el.val();
      var confirmPassword = el_confirm.val();
      if (password != confirmPassword){
        error_div.html("<font color='#f33'>Passwords do not match!</font>");
        $('#change_pwd_submit').attr('disabled', true);
      }
      else{
        error_div.html("<font color='#18AC4D'>Passwords match.</font>");
        $('#change_pwd_submit').removeAttr('disabled');
      }
  });

  $("#create_account").click(function(e){
    e.preventDefault();
    $.fancybox($('#create_account_tmpl').html());
  });

});

var old_value = "";
var new_value = "";
window.key_value_hash = {}
window.original_key_value_hash = {}

$(document).ready(function(){
  original_keys = $('.key_check').map(function(){ return $(this).attr('id'); }).get();
  for(var i=0; i<(original_keys.length); i++){
      orginal_row = "." + original_keys[i];
      original_row_value = $(orginal_row).find("td:last").text().trim();
      original_key_value_hash[original_keys[i]] = original_row_value;
    }
});

$(document).on("change", '.key_check', function(){
  $(this).toggleClass('active');
  key_val_id = "#" + $(this).closest('tr').find("td:last").attr('id');
  key_val = $(this).closest('tr').find("td:last").text().trim();
  if($(this).is(':checked')){
    $(key_val_id).attr("contentEditable", true);
    key_value_hash[$(this).attr('id')] = key_val;
   }else{
    $(key_val_id).attr("contentEditable", false);
    delete key_value_hash[$(this).attr('id')]
    $(key_val_id).html(original_key_value_hash[$(this).attr('id')]);
    }

    if( $('input.key_check').length === $('input.key_check.active').length )
    {
      $('#check_all').attr('checked','checked').addClass('active');
    }
    else{
      $('#check_all').removeAttr('checked').removeClass('active');
    }
});

$(document).on("change","#check_all", function(){
  $(this).toggleClass('active');
  if ($(this).hasClass('active'))
  { $('.key_values').attr("contentEditable", true);
    $('.key_check').attr('checked','checked').addClass('active');
    keys = $('.key_check.active').map(function(){ return $(this).attr('id'); }).get();
    for(var i=0; i<(keys.length); i++){
      row = "." + keys[i];
      row_value = $(row).find("td:last").text().trim();
      key_value_hash[keys[i]] = row_value;
      
    }
  }
  else{
    $('.key_values').attr("contentEditable", false);
    $('.key_check').removeAttr('checked').removeClass('active');
    key_value_hash = {}
    remove_keys = $('.key_check').map(function(){ return $(this).attr('id'); }).get();
    for(var i=0; i<(remove_keys.length); i++){
      uncheck_row = "." + remove_keys[i];
      $(uncheck_row).find("td:last").html(original_key_value_hash[remove_keys[i]])
    }
  }
});

$('.key_values').css("cursor", "pointer")

$(document).on("focus",".key_values", function(){
  row_class =$(this).closest('tr').attr('class');
  row_val_id = "#" + $(this).closest('tr').find("td:last").attr('id');
  row_val = $(this).closest('tr').find("td:last").text().trim();
  old_value = $(this).text().trim();
  if ( $(row_val_id).hasClass('review') ){
    if (row_val == "flagged"){
      $(row_val_id).html("unflagged");
    }else{
      $(row_val_id).html("flagged");
    }
    $(row_val_id).attr("contentEditable", false);
  }
}).on("blur", ".key_values", function(){
  new_value = $(this).text().trim();
  $(row_val_id).attr("contentEditable", true);
  if(old_value != new_value){
    delete key_value_hash[row_class]
    key_value_hash[row_class] = new_value;
  }
});
 window.gold_standard_create = function (url){
  $('#create_gs').click(function(e){
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: url,
      beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
       },
       data: {'key_value_hash' : key_value_hash},
       success: function(response){
        $.fancybox.close(true);
        $.gritter.add({
          text: "Gold standard successfully created.",
          class_name: 'gritter-notice'
          });
        window.location.reload(true);
       },
       error: function(response){
        $.fancybox.close(true);
        $.gritter.add({
          text: "Sorry, unable to create gold standard. Please try again.",
          class_name: 'gritter-alert'
          });
       }
      });
    });
  $('#cancel_gs').click(function(e){
    e.preventDefault();
    $.fancybox.close(true);
  });
  }

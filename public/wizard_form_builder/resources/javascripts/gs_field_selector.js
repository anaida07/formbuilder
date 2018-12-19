var old_value = "";
var new_value = "";
window.key_value_hash = {}
window.original_key_value_hash = {}


var populateValues = function(){

  var all_item_keys = $('.key_check').map(function(){ return $(this).attr('id'); }).get();

  storage_keys_and_items = [['explanation', 'explanation']]

  $.each(storage_keys_and_items, function(index, val) {
    item = val[1]
    local_values = localStorage[item];

    if(local_values){
      parsed_local_values = JSON.parse(local_values);
    }else{
      parsed_local_values = {}
    }

    $.each(all_item_keys, function(index, key){
      if(parsed_local_values[key]){
        value = parsed_local_values[key]
        $('#'+key).attr('checked','checked').addClass('active');
      }else{
        value = $('#'+key+'_'+item).text().trim();
      }

      $('#'+key+'_'+item).text(value);
    })
  });
}

$(document).ready(function() {
  populateValues();
});


$('.key_check').on('change', function(){
  $(this).toggleClass('active');

  if($(this).is(':checked')){
    toggleEditable($(this).closest('tr').find('td.editable'));
   }else{
    toggleEditable($(this).closest('tr').find('td.editable'), false);
  }

    if( $('input.key_check').length === $('input.key_check.active').length )
    {
      $('#check_all').attr('checked','checked').addClass('active');
    }
    else{
      $('#check_all').removeAttr('checked').removeClass('active');
    }
});

$('#check_all').on('change', function(){
  $(this).toggleClass('active');

  if ($(this).hasClass('active'))
  {
    toggleEditable($('#gs_field_selector_popup td.editable'));
    $('.key_check').attr('checked','checked').addClass('active');
  }
  else{
    toggleEditable($('#gs_field_selector_popup td.editable'), false);
    $('.key_check').removeAttr('checked').removeClass('active');
  }
});

$('.key_values').css('cursor', 'pointer')

$(document).on('focus','.key_values', function(){
  row_class =$(this).closest('tr').attr('class');
  row_val_id = "#" + $(this).attr('id');
  row_val = $(this).text().trim();
  old_value = $(this).text().trim();

  if ( $(row_val_id).hasClass('review') ){
    if (row_val == 'flagged'){
      $(row_val_id).html('unflagged');
    }else{
      $(row_val_id).html('flagged');
    }
    $(row_val_id).attr('contentEditable', false);
  }
}).on('blur', '.key_values', function(){
  new_value = $(this).text().trim();
  $(row_val_id).attr("contentEditable", true);
  if(old_value != new_value){
    delete key_value_hash[row_class]
    key_value_hash[row_class] = new_value;
  }
});



// Store selected values at localstorage

$('#valid_for_all').on('change', function(){
  $(this).toggleClass('active');
  checked = $(this).hasClass('active');
  localStorage.gs_criteria_for_all = (localStorage.gs_criteria_for_all == 'true' && checked == false) ? false : true
});

$('#gs_field_selector_apply').on('click', function(){
  storeValues();
  $.fancybox.close();
})

var storeValues = function(){
  selected_values = {}
  selected_values['expected_output'] = prepareFlaggedItems(fetchSelectedFieldsValuesFor('expected'));
  selected_values['sample_output'] = prepareFlaggedItems(fetchSelectedFieldsValuesFor('sample'));
  selected_values['explanation'] = fetchSelectedFieldsValuesFor('explanation');
  localStorage.edited_from_popup = true;
  localStorage.gs_selected_fields = JSON.stringify(selected_values);
}

var fetchSelectedFieldsValuesFor = function(item){
  var keys = $('.key_check.active').map(function(){ return $(this).attr('id'); }).get()
  var newObj = {}
  $.each(keys, function(index, key){
    value = $('#'+key+'_'+item).text().trim();

    if(localStorage.is_transcription_task == 'true'){
       if(value != ""){ newObj[key] = value };
    }else{
      newObj[key] = value ;
    }

  })

  localStorage[item] = JSON.stringify(newObj);

  return newObj
}


var prepareFlaggedItems = function(object){
  if(localStorage.is_current_review_jt == 'true'){
    var flagged_items = ''
    $.each(object, function(key, value) {
      if(value == 'flagged'){
       flagged_items += key
       flagged_items += ','
     }
   })
    return {flagged_items_csv: flagged_items}

  }else{
    return object
  }
}


var toggleEditable = function(items, editable){

  if(editable==undefined){ var editable = true}

  $.each(items, function(){
    $(this).attr('contentEditable', editable);
  })
}

$(document).ready(function(){
  $('.editable').on('keyup paste', function () {
    var gs_field_selector_table = $("#gs_field_selector_table");
    var inner = $("#fancybox-inner");
    var wrap = $("#fancybox-wrap");
    wrap.css({
      width : gs_field_selector_table.outerWidth() + 20 + 'px',
      height : gs_field_selector_table.outerHeight()  + 100 + 'px'
    });
    $.fancybox.center();
  });
});
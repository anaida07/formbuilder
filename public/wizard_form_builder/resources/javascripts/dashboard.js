function showTemplateInfo(e) {
  e.preventDefault();
  
  var template_id = $(this).attr('title');
  
  $('#template-list').hide();
  $('#' + template_id).show();
}

function showTemplateList(e) {
  e.preventDefault();
  
  $('.template-info').hide();
  $('#template-list').css('left', 0).css('opacity', 1).show();
}
  
$( function() {
  $('.ttype a').live('click', showTemplateInfo );
  $('.back').live('click', showTemplateList );
});
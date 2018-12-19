function resizeSidebar() {
  $('.sidebar .inner').height($(window).height() - $('header').height() - parseInt($('.sidebar .inner').css('padding-top')) - parseInt($('.sidebar .inner').css('padding-bottom')));
}


$( function() {
  // Show any flash notices
  if( $.trim( $('.notice .container').text() ) != '' ) {
    $('.notice').slideDown();
    setTimeout("$('.notice').slideUp()", 4000);
  }
  
  
  $(window).bind('resize', resizeSidebar);
  resizeSidebar();
});
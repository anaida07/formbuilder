$.fn.extend({
  // Add 5 more list items to an ol
  addMoreArrayFields: function() {
    var lis = this.children().slice(0, 5).clone();
    lis.children('input').val('');
    this.append( lis );
    return this;
  },
  
  // Decrement a form field
  decrement: function() {
    var val = parseInt(this.val());
    this.val( val - 1 );
    return this;
  },
  
  // Increment a form field
  increment: function() {
    var val = parseInt(this.val());
    this.val( val + 1 );
    return this;
  },
  
  // Rotate an element clockwise 90 degrees
  rotate90: function() {
    var angle = this.data('angle');
    if( angle == null ) 
      angle = 0;

    angle += 90;

    if( angle == 360 )
      angle = 0;

    var scaleY = 1;
    
    if( this.height() > this.width() && this.height() > 390 ) {
      if( angle == 90 || angle == 270 ) {
        scaleY = 390.0 / this.height();
      }
    }
    else if( this.width() > this.height() ) {
      // Make the containing div higher to enclose this image
      switch( angle ) {
        case 90:
        case 270:
          this.parents('.holder').height(this.width());
          this.css('margin-top', 60);
          break;
        case 0:
        case 180:
          this.parents('.holder').height(this.height());
          this.css('margin-top', 0);
          break;
      }
    }
    
    // uses jquery-transform plugin
    this.transform({scale: [scaleY, scaleY], rotate: angle + 'deg'});

    this.data('angle', angle);

    return this;
  }
});

$( function() {
  
  // Switch the main image when the TOC is clicked on
  $("#image-viewer #toc img").click( function(evt) {
    // Change which small image is marked as selected
    $(this).addClass('selected').siblings().removeClass('selected');
    
    // Change the large image
    var imgSrc = $(this).attr('src');
    $('#mainimage a').attr('href', imgSrc);
    $('#mainimage img').attr('src', imgSrc);
  });
  
  
  // Allow adding more items to any list field
  $('.add-more').click(function( evt ) { 
    evt.preventDefault();
    $(this).parent().prev('ol').addMoreArrayFields();
  });
  
  
  // Make enter act like tab in form fields, NOT submit the form
  $('input[type=text]').live('keypress', function(evt) { 
    if( evt.which == 13 ) {
      evt.preventDefault();
      
      if( $(this).parents("li").is(':last-child') )
        $(this).parents('ol').addMoreArrayFields();
      
      $(this).parents("li").next().children('input').focus();
    }
  });
  
  
  // When a review row is clicked, increment or decrement the errors and mark it as flagged
  $('.review').live( 'click', function() {
    if( $(this).hasClass('flagged') ) {
      $(this).removeClass('flagged')
             .find('input[type=checkbox]').prop('checked', false);
    }
    else {
      $(this).addClass('flagged').find('input[type=checkbox]').prop('checked', true);
    }
  });
  
  $('#image-rotate').click( function(evt) {
    evt.preventDefault();
    $($(this).attr('data-image')).rotate90();
  });
  
});
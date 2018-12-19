/* This file is effectively a state machine to lead the user through
  the different parts of the image task. The state variables are currentImage
  and currentStep and are global vars.
*/

var currentImage = 0;
var currentStep = 0;

var jcrop_api;

// Our standard options to jcrop
var jcrop_options = {
  onSelect: recordCoords,
  boxWidth: 390,  // this field defines how large the image will be scaled
  bgOpacity: .4   // the coordinates will still be reported in reference to orig image
};

function recordCoords(c) {
  var image_section = $(this.ui.holder).parents('section');

  image_section.find('.offset_x').val(c.x);
  image_section.find('.offset_y').val(c.y);
  image_section.find('.dimension_x').val(c.w);
  image_section.find('.dimension_y').val(c.h);
}

function nextImage() {
  if( $('#image-' + (currentImage + 1)).length > 0 ) {
    // More images to evaluate
    currentImage++;

    $('.task-part').hide();
    $('#image-' + currentImage).show();

    // Set up jcrop for the next image; we must do it here so that the image gets scaled appropriately
    // We'll then disable it so it isn't visible during the legibility test
    jcrop_api = $.Jcrop('#image-' + currentImage + ' .cropper', jcrop_options);
    jcrop_api.disable();

    currentStep = 0;
  } else {
    // We're done, show the submit button 
    $('.usability, .rotate').hide();
    $('input#final-submit').show();
  }
}

function nextStep(evt) {
  // Rudimentary state machine
  evt.preventDefault();
  
  var section = $(this).parents('.task-part');
  
  switch( currentStep ) {
    case 0: // image legibility
      // Have they selected an option?
      if( section.find('input.usable-radio:checked').length == 0 ) {
        alert("You must select an option");
        break;
      }
      
      // Did they mark this image as illegible? If so, move them to the next image
      if( section.find('input.usable-radio:checked').val() == 'false' ) {
        nextImage();
        break;
      }
    
      section.find('.usability').hide();
      section.find('.crop').show();
      
      // Enable the cropper
      jcrop_api.enable();
      
      currentStep++;
      break;

    case 1: // image crop
      // Have they actually cropped anything?
      if( section.find('input.offset_x').val() == '' ) {
        alert("You must select a portion of the image");
        break;
      }
      
      section.find('.crop').hide();
      section.find('.rotate').show();
      
      // Disable cropper
      jcrop_api.disable();
      
      currentStep++;
      break;

    case 2: // image rotation
      // If the rotation angle is blank (no rotation), set it to 0
      var rotation_angle = section.find('input.rotation_angle');
      if ( rotation_angle.val() == '' ) 
        rotation_angle.val(0);
      
      nextImage();
      
      break;
  }
}

$(window).load( function() {
  // This must be invoked from window load event, or else the image is too big
  // Also, we'll enable the images one at a time for jcrop
  // because the true-sizing doesn't work (scaled, but orig coordinates)
  // if the image is hidden when jcrop is enabled
  jcrop_api = $.Jcrop('#image-0 .cropper', jcrop_options);
  
  // Disable cropping for now
  jcrop_api.disable();
});

$( function() {
  $('.next-step').click( nextStep );
  $('.rotator').click( function(evt) { 
    evt.preventDefault();
    var image_holder = $(this).parents('.task-part').children('.image-holder').rotate90();
    $(this).parents('.task-part').children('input.rotation_angle').val(image_holder.data('angle'));    
  });
});
// We want to capture the submit if the job is a qualification
// job. Verify that the user is doing the job correctly so we can
// give the user feedback.

var failedQuals = [];

function checkQualSubmission() {
  var no_errors = true;

  $.ajax({
    type: "POST",
    url: check_qual_url,
    data: $('#job-form').serialize(),
    success: function(data) {
      // Remove from the existing marks
      $.each(failedQuals, function(i, name) {
        if( name[name.length - 1] == '_' ) {
          $('[name=' + name + ']').parents('ol').removeClass('qual-fail');
        } else {
          $('[name=' + name + ']').removeClass('qual-fail')
                                  .parents('.form-item').removeClass('qual-fail');
        }
      });

      failedQuals = [];

      if(data.errors) {
        errors = data.errors;
        no_errors = false;
      
        // Remark incorrect fields.
        $.each(errors, function(i, name) {
          failedQuals.push(name);

          if( name[name.length - 1] == '_' ) {
            $('[name=' + name + ']').parents('ol').addClass('qual-fail');
          } else {
            $('[name=' + name + ']').addClass('qual-fail')
                                    .parents('.form-item').addClass('qual-fail');
          }
        });
      }
    },
    dataType: "json",
    async: false
  });

  return no_errors;
}

$( function() {

  if( typeof check_qual_url !== 'undefined') {
    $('#job-form').submit( checkQualSubmission );
    
    // Pop the qual instructions up in a lightbox
    $.fancybox( $("#qualification_dialog").append($(".instructions").clone()).width(700) );
  }

});

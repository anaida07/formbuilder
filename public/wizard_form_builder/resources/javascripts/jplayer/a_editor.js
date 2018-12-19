$( function() {
  
  // Show the 'missing text' checkbox if there is no text
  if( $('.taggable').length == 0 ) {
    $('#missing_text_clicker').show();
  }

  $('.taggable').click( function() { 
    $(this).toggleClass('tagged');
  });


  // setup submit button to copy text from editable divs into form elements
  $("#submit").click( function() {
    var submit_json;

    if( $('.taggable').length == 0 ) {

      submit_json = {
        text_result: { status: $('#missing_text').is(':checked') ? 'flagged' : 'unflagged' }
      }

    } else {

      var flaggedIndices = [],
          flaggedWords = [];
    
      $('.taggable').each( function(index, item) { 
        if( $(this).hasClass('tagged') ) {
          flaggedIndices.push(index);
          flaggedWords.push($(this).text());
        }
      });
    
      submit_json = {
        text_result: {
          status: 'subflagged',
          numItems: $("span.taggable").length,
          flaggedIndices: flaggedIndices,
          flaggedWords: flaggedWords
        }
      }

    }
    
    $("#flagged_items").val( JSON.stringify(submit_json) );
    
    return true;
  });
  
});

//Constants for transcription qualification types

function processSubmission() {
  if( typeof check_qual_url != 'undefined' ) {
    var no_errors = true;

    var user_transcription = $("#transcription-text").val()

		// remove ambiguous characters and strip extra whitespace to be tolerant
		var user_transcription_array = user_transcription.toLowerCase().replace(/\,/g,'').replace(/\./g,'').replace('[sp?]','').replace(/\?/g,'').replace('um','').replace('uh','').replace('umm','').replace('-',' ').replace(/\s{2,}/g,' ').replace(/^\s+|\s+$/g, '').split(" ");

		// trailing single whitespace is mostly OK, strip it out
		if (user_transcription_array[user_transcription_array.length - 1] == ""){
			user_transcription_array.pop();
		}

    // inject this back into the form.  We restore it below if there was an
    // error.
    $("#transcription-text").val(user_transcription_array.join(" "))

    $.ajax({
      type: "post",
      url: check_qual_url,
      data: $('#turk-t-form').serialize(),
      success: function(data) {
        if(data.errors) {
          // restore the user's text
          $("#transcription-text").val(user_transcription)

          $("#t_qual_dialog").dialog('open');
          no_errors = false;
        }
      },
      datatype: "json",
      async: false
    });

    return no_errors;
	}
}

$(document).ready( function() {
	// Initialize dialog boxes
	$('#dialog').dialog( { buttons: { "OK": function() { $(this).dialog("close"); } }, draggable: false, resizable: false, modal: true, autoOpen: false });
	$('#t_qual_dialog').dialog( { buttons: { "OK": function() { $(this).dialog("close"); } }, draggable: false, resizable: false, modal: true, autoOpen: false });

	// code section to qualify T workers
	$("#turk-t-form").submit( processSubmission )
});

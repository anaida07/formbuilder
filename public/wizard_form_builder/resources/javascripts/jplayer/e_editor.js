var shownXXdialog = false;

// In case we change out this editor once again
function getChunkByTimestamp(ts) {
    //cleantext = editor_swf.getChunk(ts);
    var cleantext = $("#chunk_" + ts).html();
    cleantext = cleantext.replace(/<p>|<P>/g, '\n');
    cleantext = cleantext.replace(/<\/p>|<\/P>/g, '');
    cleantext = cleantext.replace(/<br>/g, '\n');
    cleantext = cleantext.replace(/<br\/>/g, '\n');
    cleantext = cleantext.replace(/<BR>/g, '\n');
    cleantext = cleantext.replace(/<BR\/>/g, '\n');
    cleantext = cleantext.replace(/\r\n/, '\n');
    cleantext = cleantext.replace(/&nbsp;/g, ' ');
    return cleantext.replace(/[\u003D]|[^\u000A\u0020-\u007A]/g,'');
}

// TODO: Move this to the new qual system
function qualificationTaskCheck() {
    var first_newline_present = true;
    var first_space_present = true;
    var second_space_present = true;

    for(i = 0; i < timestamps.length; i++) {
        var currentChunk = getChunkByTimestamp(timestamps[i]);

        if( currentChunk.search(/\[music\]/) !== -1 ) {
            $("#e_qual_dialog").dialog('open');
            return false;
        }
        if( currentChunk.search(/\[sp\?\]/) !== -1 ) {
            $("#e_qual_dialog").dialog('open');
            return false;
        }
        if( currentChunk.search(/Uh/i) !== -1 ) {
            $("#e_qual_dialog").dialog('open');
            return false;
        }
        if( currentChunk.search(/Right/) !== -1 ) {
            $("#e_qual_dialog").dialog('open');
            return false;
        }
        //                              if( currentChunk.search(/(<br><br>)([&nbsp;]*)(323)/) !== -1 ) {
        //                                      first_newline_present = true;
        //                              }
        if( currentChunk.search(/213is/) !== -1 ) {
            $("#e_qual_dialog").dialog('open');
            return false;
        }
        if( currentChunk.search(/(Woman)/) !== -1 ) {
            $("#e_qual_dialog").dialog('open');
            return false;
        }
        if( currentChunk.search(/perfect/) !== -1 ) {
            $("#e_qual_dialog").dialog('open');
            return false;
        }
        if( currentChunk.search(/\.Gabriel/) !== -1 ) {
            first_space_present = false;
        }
        if( currentChunk.search(/(readyset)/) !== -1 ) {
            second_space_present = false;
        }

    }

    if(first_newline_present && first_space_present && second_space_present){
        $.post('/hits/process_qual', {assignmentId: $("#assignmentId").val()});
        return true;
    }

    $("#e_qual_dialog").dialog('open');
    return false;
}

function processForm() {
    try {
        if( typeof check_qual_url != 'undefined' ) {
            return qualificationTaskCheck();
        }

        if( !shownXXdialog ) {
            for(var i = 0; i < timestamps.length; i++) {
                if( getChunkByTimestamp(timestamps[i]).search(/\[xx\]/i) !== -1) {
                    $("#xx_dialog").dialog('open');
                    shownXXdialog = true;
                    return false;
                }
            }
        }

    // Set form fields with the text in the editor
    for(var i = 0; i < timestamps.length; i++) {
      var formChunkNode = $("#chunk_" + i + "_text");
      formChunkNode.val(getChunkByTimestamp(timestamps[i]));
    }
    
    return true;
    
  }
  catch (e) {
    var msg = "An error has occurred processing this form submission. Please copy and paste the debugging information " +
              "below and send it to SpeakerText using the feedback form in the task and we will send you a bonus.";
    msg += "\n\n";
    msg += e.name + ": " + e.message;
    
    alert(msg);
    
    return false;
  }
}

$(document).ready( function() {

  // setup submit button to copy text from editable divs into form elements
  $("#turk-e-form").submit( processForm );
  
  /* Enable IE to preview editor contents */
  var isMSIE = /*@cc_on!@*/false;
  
  if( isMSIE ) {
    $("#ie-preview").show();
    $("#ie-preview-dialog").dialog( { modal: true, resizable: false, draggable: false, autoOpen: false, width: 800} );
  
    $("#preview-mode").click( function() { 
      $(".uneditable, .editable").each( function(idx, item) {
        /* Sanitize IE paragraph breaks */
        html = $(item).html();
        html = html.replace(/<[p|P]>(.*?)<\/[p|P]>/, '$1');
        html = html.replace(/<[p|P]>(.*?)<\/[p|P]>/, '<br/><br/>$1');
        $(item).html(html);
        $("#chunk_preview_" + idx).html(html);
      });
        
      $("#ie-preview-dialog").dialog('open');

      return false;
    });
  }
  
  // prevent copy/paste
  $(".etext .editable").bind("cut copy paste", function (e) {
    e.preventDefault();
  });

  // Initialize dialog boxes
  $('#xx_dialog').dialog( { buttons: { "OK": function() { $(this).dialog("close"); } }, draggable: false, resizable: false, modal: true, autoOpen: false });
  $('#e_qual_dialog').dialog( { buttons: { "OK": function() { $(this).dialog("close"); } }, draggable: false, resizable: false, modal: true, autoOpen: false });


});

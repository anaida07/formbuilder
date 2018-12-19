$(function(){
  
  if( $("#jquery_jplayer").length == 0 )
    return;
    
    // FUCK YOU IE
  if(!Array.indexOf){
    Array.prototype.indexOf = function(obj){
      for(var i=0; i<this.length; i++){
        if(this[i]==obj){
          return i;
        }
      }
      return -1;
    }
  }

  function scrollToTime(t) {
    $("#jquery_jplayer").jPlayer("playHeadTime", t);
    if( $("#pause").css("display") == "none" ) {
      showPauseBtn();
    }
  }

  $(".clickable").click( function() { scrollToTime( $(this).attr('id').split("_")[1] ); return false; });

  var global_lp = 0;
  var current_ts = -1;    // where the highlight is

  $("#jquery_jplayer").jPlayer({
    ready: function ()
    {
      if( audio_source != "" ) {
        this.element.jPlayer("setFile", audio_source);
      }
      if( autostart ) {
        this.element.jPlayer("play");
        showPauseBtn();
      }
    },
    customCssIds: true,
    nativeSupport: false,           // turn this back on later?
    swfPath: "/javascripts/jplayer"
  })
  .jPlayer("onProgressChange", function(lp,ppr,ppa,pt,tt) {
    var lpInt = parseInt(lp);
    var ppaInt = parseInt(ppa);
  
    var ts;
    var tsid;

    global_lp = lpInt;

    $('#loaderBar').progressbar('option', 'value', lpInt);
    $('#sliderPlayback').slider('option', 'value', ppaInt);
  
    if (trackprogress) {
      for( ts = timestamps.length - 1; ts >= 0; ts-- ) {
        if (pt > timestamps[ts]) {
          if( timestamps[ts] != current_ts ) {
            $("#chunk_" + current_ts).removeClass("current_chunk");
            $("#chunk_" + timestamps[ts]).addClass("current_chunk");
          
            current_ts = timestamps[ts];
          }
          return;
        }
      }
    }
  })
  .jPlayer("onSoundComplete", function() {
    this.element.jPlayer("play");
  });

  $("#pause").hide();

  function playTrack(t,n)
  {
    $("#jquery_jplayer").jPlayer("setFile", t).jPlayer("play");

    showPauseBtn();

    return false;
  }

  function showPauseBtn()
  {
    $("#play").hide();
    $("#pause").show();
  }

  function showPlayBtn()
  {
    $("#pause").hide();
    $("#play").show();
  }

  $("#play").click(function() {
    $("#jquery_jplayer").jPlayer("play");
    showPauseBtn();
    return false;
  });

  $("#pause").click(function() {
    $("#jquery_jplayer").jPlayer("pause");
    showPlayBtn();
    return false;
  });

  $("#stop").click(function() {
    $("#jquery_jplayer").jPlayer("stop");
    showPlayBtn();
    return false;
  });


  $("#volume-min").click( function() {
    $('#jquery_jplayer').jPlayer("volume", 0);
    $('#sliderVolume').slider('option', 'value', 0);
    return false;
  });

  $("#volume-max").click( function() {
    $('#jquery_jplayer').jPlayer("volume", 100);
    $('#sliderVolume').slider('option', 'value', 100);
    return false;
  });

  $("#player_progress_ctrl_bar a").live( "click", function() {
    $("#jquery_jplayer").jPlayer("playHead", this.id.substring(3)*(100.0/global_lp));
    if( $("#pause").css("display") == "none" ) {
      showPauseBtn();
    }
    return false;
  });

  // Slider
  $('#sliderPlayback').slider({
    max: 100,
    range: 'min',
    animate: true,

    slide: function(event, ui) {
      $("#jquery_jplayer").jPlayer("playHead", ui.value*(100.0/global_lp));
      if( $("#pause").css("display") == "none" ) {
        showPauseBtn();
      }
    }
  });

  $('#sliderVolume').slider({
    value : 50,
    max: 100,
    range: 'min',
    animate: true,

    slide: function(event, ui) {
      $("#jquery_jplayer").jPlayer("volume", ui.value);
    }
  });

  $('#loaderBar').progressbar();


  //hover states on the static widgets
  $('#dialog_link, ul#icons li').hover(
    function() { $(this).addClass('ui-state-hover'); },
    function() { $(this).removeClass('ui-state-hover'); }
  );

  function startOrStopAudio() {
    if( $("#pause").css('display') == 'none' ) {
      $("#jquery_jplayer").jPlayer("play");
      showPauseBtn();
    }
    else {
      $("#jquery_jplayer").jPlayer("pause");
      showPlayBtn();
    }
    return false;
  }

  function submitTurkForm() {
    $("#turk-t-form").submit();
  }

  function rewindFive() {
    playedTime = $("#jquery_jplayer").jPlayer("getData", "diag.playedTime");
    if(playedTime - 5000 < 0)
      $("#jquery_jplayer").jPlayer("playHeadTime", 0);
    else
      $("#jquery_jplayer").jPlayer("playHeadTime", playedTime-5000);
    
    if( $("#pause").css('display') == 'none' ) {
      showPauseBtn();
    }
    return false;
  }

  function insertXX() {
    var text = $("#transcription-text").val();
    var cursor_pos = $("#transcription-text").getSelection().start;
    $("#transcription-text").val(text.substring(0, cursor_pos) + "[sp?] " + text.substring(cursor_pos));
  }

  function insertSP() {
    var text = $("#transcription-text").val();
    var cursor_pos = $("#transcription-text").getSelection().start;
    $("#transcription-text").val(text.substring(0, cursor_pos) + "[xx] " + text.substring(cursor_pos));
  }

  if(from_admin == false) {
    // keybindings for HIT player
    // must specifically enable them in the textarea
    // ctrl-space starts and stops audio
    $(document).bind('keydown', 'ctrl+space', startOrStopAudio);
  
    // ctrl-; submits hit
    $(document).bind('keypress', 'ctrl+=', submitTurkForm);
  
    // ctrl-, moves time slider backwards 5 seconds
    $(document).bind('keydown', 'ctrl+/', rewindFive);
  
    if( $("#transcription-text").length ) {
    
      $("#transcription-text").bind('keydown', 'ctrl+space', startOrStopAudio);
      $("#transcription-text").bind('keypress', 'ctrl+=', submitTurkForm);
      $("#transcription-text").bind('keydown', 'ctrl+/', rewindFive);
  
      // ctrl-u inserts [xx]
      $("#transcription-text").bind('keyup', 'ctrl+i', insertXX);
  
      // ctrl-i inserts [sp?]
      $("#transcription-text").bind('keyup', 'ctrl+u', insertSP);
    
      $("#transcription-text").focus();
    
    } 
  }
});

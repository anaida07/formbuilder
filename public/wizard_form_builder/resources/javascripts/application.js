// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults


function supports_input_placeholder() {
  var i = document.createElement('input');
  return 'placeholder' in i;
}

// place placeholder text in text fields for non-webkit browsers
function activatePlaceholders() {
  if (supports_input_placeholder()) return false;
  
  $("input[type=text]").each( function() {
    if ($(this).attr("placeholder") && $(this).attr("placeholder").length > 0) {
      $(this).val($(this).attr("placeholder"));
      $(this).addClass("placeholder");  
      $(this).click( function() {
        if ($(this).val() == $(this).attr("placeholder")) {
          $(this).val("");
          $(this).removeClass("placeholder");         
        }
        return false;
      });

      $(this).blur( function() {
        if ($(this).val().length < 1) {
          $(this).val( $(this).attr("placeholder") );
          $(this).addClass("placeholder");  
        }
      });
    }
  });
}

// Google Analytics event tracking for Vimeo Videos
function activateVimeoTracking() {
  var videos = $('iframe[src*=vimeo]')

  if (videos.length > 0) {
    var froogaloop = document.createElement('script');
    froogaloop.type = 'text/javascript';
    froogaloop.async = true;
    froogaloop.src = 'https://secure-a.vimeocdn.com/js/froogaloop2.min.js';

    document.getElementsByTagName('head')[0].appendChild(froogaloop);

    froogaloop.onload = function () {
      for (var i = 0, length = videos.length; i < length; i++) {
        $f(videos[i]).addEvent('ready', ready);
      }

      // Callbacks - data will be the player_id from the vimeo src params
      function ready(player_id) {
        $f(player_id).addEvent('play', function(data) {
          _gaq.push(['_trackEvent', 'videos', 'play', data, null, true])
        });

        $f(player_id).addEvent('finish', function(data) {
          _gaq.push(['_trackEvent', 'videos', 'finish', data, null, true])
        });
      }
    }
  }
}

$.extend({
  getUrlVars: function(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  },
  getUrlVar: function(name){
    return $.getUrlVars()[name];
  }
});

$(document).ready( function() {
  activatePlaceholders();

  activateVimeoTracking();

  $(document).on('click', 'a[data-popup]', function(e) {
     window.open($(this).attr('href'));
     e.preventDefault();
  });

  // For HITs: Only show the submit button if they have javascript
  $(".showjs").show();

  if( typeof $()['tipsy'] === 'function' )
    $(".tooltip").tipsy({gravity: 'n', opacity: .9, live: true});
});

/**
 * @class WizardFormBuilder.Accordion
 */
 
$.Controller('WizardFormBuilder.Accordion',
/* @Static */
{
  
},
/* @Prototype */
{
  init: function() {
    // activate the first section
    this.activate( this.element.children(".accordion-item:first") )
  },
  
  // When this is clicked, deactivate all fields (get rid of editor pane if it's open)
  click: function() {
   OpenAjax.hub.publish('fields.deactivate_all');
  },
  
  // on an li click, activates new tab
  '.accordion-header click': function(el, ev) {
    ev.preventDefault();
    
    if( ! el.parent().hasClass('active') ) {
      this.activate(el.parent());
    }
  },
  
  // hides old active tab, shows new one
  
  'activate': function(el) {
    var toHide = this.element.find('.active').removeClass('active')
      .find('.accordion-content'),
    
    toShow = el.addClass('active')
      .find('.accordion-content');
      
    this.slide({
      widget: this,
      toShow: toShow,
      toHide: toHide,
      complete: function() { OpenAjax.hub.publish('accordion.item-changed', el.attr('id')); },
      easing: 'swing',
      duration: 300
    });
  },

  // This animation code SHAMELESSLY stolen from jQuery UI
  slide: function(options, additions) {
    if ( options.prevShow || options.prevHide ) {
      options.prevHide.stop( true, true );
      options.toHide = options.prevShow;
    }

    var showOverflow = options.toShow.css( "overflow" ),
      hideOverflow = options.toHide.css( "overflow" ),
      percentDone = 0,
      showProps = {},
      hideProps = {},
      fxAttrs = [ "height", "paddingTop", "paddingBottom" ],
      originalWidth;
    options = $.extend({
      easing: "swing",
      duration: 300
    }, options, additions );

    options.widget.lastToggle = options;

    if ( !options.toHide.size() ) {
      originalWidth = options.toShow[0].style.width;
      options.toShow
        .show()
        .width( options.toShow.width() )
        .hide()
        .animate({
          height: "show",
          paddingTop: "show",
          paddingBottom: "show"
        }, {
          duration: options.duration,
          easing: options.easing,
          complete: function() {
            options.toShow.width( originalWidth );
            options.complete();
          }
        });
      return;
    }
    if ( !options.toShow.size() ) {
      options.toHide.animate({
        height: "hide",
        paddingTop: "hide",
        paddingBottom: "hide"
      }, options );
      return;
    }
    // fix width before calculating height of hidden element
    var s = options.toShow;
    originalWidth = s[0].style.width;
    s.width( parseInt( s.parent().width(), 10 )
      - parseInt( s.css( "paddingLeft" ), 10 )
      - parseInt( s.css( "paddingRight" ), 10 )
      - ( parseInt( s.css( "borderLeftWidth" ), 10 ) || 0 )
      - ( parseInt( s.css( "borderRightWidth" ), 10) || 0 ) );

    $.each( fxAttrs, function( i, prop ) {
      hideProps[ prop ] = "hide";

      var parts = ( "" + $.css( options.toShow[0], prop ) ).match( /^([\d+-.]+)(.*)$/ ),
        // work around bug when a panel has no height - #7335
        propVal = prop === "height" && parts[ 1 ] === "0" ? 1 : parts[ 1 ];
      showProps[ prop ] = {
        value: propVal,
        unit: parts[ 2 ] || "px"
      };
    });
    options.toShow.css({ height: 0, overflow: "hidden" }).show();
    options.toHide
      .filter( ":hidden" )
        .each( options.complete )
      .end()
      .filter( ":visible" )
      .animate( hideProps, {
      step: function( now, settings ) {
        if ( settings.prop == "height" || settings.prop == "paddingTop" || settings.prop == "paddingBottom" ) {
          percentDone = ( settings.end - settings.start === 0 ) ? 0 :
            ( settings.now - settings.start ) / ( settings.end - settings.start );
        }

        options.toShow[ 0 ].style[ settings.prop ] =
          ( percentDone * showProps[ settings.prop ].value )
          + showProps[ settings.prop ].unit;
      },
      duration: options.duration,
      easing: options.easing,
      complete: function() {
        options.toShow.css({
          width: originalWidth,
          overflow: showOverflow
        });
        options.toHide.css( "overflow", hideOverflow );
        options.complete();
      }
    });
  }
  
});

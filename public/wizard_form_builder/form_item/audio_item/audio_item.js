steal('./views/show.ejs', './views/properties.ejs').then( function($) {

WizardFormBuilder.FormItem.extend('WizardFormBuilder.FormItem.AudioItem', 
/* STATIC */
{
},
/* PROTOTYPE */
{
  
  jPlayerReady: false,
  media: null,
  
  // Returns the jPlayer element in this widget
  player: function() {
    return this.element.find('.jp-jplayer');
  },
  
  trySetMedia: function() {
    // Wait until jPlayer is ready and we know what media we are given
    if( this.jPlayerReady === true && this.media !== null ) {
      this.player().jPlayer('setMedia', this.media);
                                      
      if( this.model.autoplay ) {
        this.player().jPlayer('play');
      } else {
        this.player().jPlayer('load'); // preload media
      }
    }
  },
  
  redraw: function() {
    var controller = this;
    
    this.player().jPlayer({
      swfPath: "/wizard_form_builder/resources/jplayer-2.1.0",
      wmode: "window",
      loop: this.model.repeat,
      solution: "flash, html",
      
      ready: function() { 
        controller.jPlayerReady = true;
        controller.trySetMedia();
      },
      
      // How jPlayer determines its top level container
      cssSelectorAncestor: '.' + this.model.identity()
    });
    
  },
  
  subscribeToTimeUpdates: function(handler) {
    $(this.player()).bind($.jPlayer.event.timeupdate, handler);
  },
  
  /* RIGHT NOW, ONLY SUPPORT MP3 FILES */
  value: function(val) {
    this.media = {mp3: val}
    this.trySetMedia();
  }
});

});

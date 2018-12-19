steal('./views/show.ejs', './views/properties.ejs').then( function($) {

WizardFormBuilder.FormItem.extend('WizardFormBuilder.FormItem.HtmlField',
/* STATIC */
{
  has_set_bust: false,
  bust_interval: null,
  
  set_redirect_bust: function() {
    var controller = this;
    
    if( this.has_set_bust == true )
      return;
    
    this.has_set_bust = true;
    
    // Create a random seed value, making it almost impossible to 
    // determine what is being tested for.
    var prevent_bust = Math.random() * 3000; 

    // enclose everything in a function, so that it cannot be addressed
    function iniFunc ( init ) { 
      
        // The function is no longer in scope of the main window.
        function onbeforeunload() { 
          if( window.top.location.href.match(/gethumanoid/) || 
              window.top.location.href.match(/redwoodtech/) || 
              window.top.location.href.match(/cloudfactory/) || 
              window.top.location.href.match(/mturk.com/)  ||
              window.top.location.href.match(/speakertext/) ){
              clearInterval(controller.bust_interval)
              window.onbeforeunload = null;
          } else {
            prevent_bust++;
          } 
        }
        window.onbeforeunload = onbeforeunload;
        controller.bust_interval = setInterval( function() {
            // make sure the function was not deleted.
            if( window.onbeforeunload != onbeforeunload )
            {
                prevent_bust = init + 1;
                window.onbeforeunload = onbeforeunload;
            }
            if (prevent_bust > init ) {  // All comparison is to the random seed.
                prevent_bust -= 2;
                $('iframe').each( function(i, el) {
                  $(el).replaceWith( 
                    $('<div/>').width( $(el).parents('.form-item').model().attr('width') ).height($(el).parents('.form-item').model().attr('height')).css('word-wrap', 'break-word')
                               .append( $('<p/>').html("This iFrame was trying to redirect. Please visit the website here:") )
                               .append( $('<p/>').append( $('<a/>').attr('target', '_blank').attr('href', $(el).attr('src')).html( $(el).attr('src') )) )
                  );
                });
                
                window.top.location = 'http://redwoodtech.net/no_content';
                
                clearInterval(controller.bust_interval);
                window.onbeforeunload = null;
                
                // Unfortunately, you have absolutely no idea which website caused
                // the incrementation, so you cannot replace it with a link!
                //
                // You might try to simply ignore it and just use the iframe as is -- 
                // theoretically, they are no longer able to bust this frame. 
                // (this theory will be disproved below).
           }
       }, 1 );
    };
    iniFunc( prevent_bust );
  }
},
/* PROTOTYPE */
{
  redraw: function() {
    this.element.find('iframe')
      .width(this.model.attr('width'))
      .height(this.model.attr('height'))
    
    this.element.children('label').width(this.model.attr('width'));
  },
  
  // Set the value of this component for the review job
  value: function(val) {
    this.element.find('iframe').attr('src', val);
    
    this.Class.set_redirect_bust();
  },
  
  beforeSubmit: function() {
    if( this.Class.bust_interval !== null ) {
      // Clear the interval that will prevent the submit button before we submit
      clearInterval(this.Class.bust_interval);
    }
  }
  
});

});

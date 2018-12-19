steal('./views/guiders.ejs').then( function($) {

/**
 * @class WizardFormBuilder.Tutorial
 */
 
$.Controller('WizardFormBuilder.Tutorial',
/* @Static */
{
},
/* @Prototype */
{
  shownGuiders: {},

  init: function() {
    this.element.html( this.view('guiders') );
    this.createGuiders();
  },
  
  createGuiders: function() {
    var controller = this;
    
    // guiders.createGuider({
    //   title: "Step 3: Define Jobs",
    //   description: $('#step-3-guider').html(),
    //   id: 'worker-tasks',
    //   position: 8,
    //   attachTo: '#step-worker-tasks',
    //   overlay: true
    // });
    // 
    // guiders.createGuider({
    //   title: "Step 2: Add Data Types",
    //   description: $('#step-2-guider').html(),
    //   id: 'data-types',
    //   position: 8,
    //   attachTo: '#step-data-types',
    //   overlay: true
    // });    
    // 
    // guiders.createGuider({
    //   title: "Step 1: Create a Title",
    //   description: $('#step-1-guider').html(),
    //   id: 'title',
    //   position: 8,
    //   attachTo: "#step-title",
    //   overlay: true
    // });
    
   guiders.createGuider({
     // do callback this way so that 'this' is the right object
     buttons: [{name: "Let's Go!", onclick: function() { controller.introClosed(); } } ],
     buttonCustomHTML: "<label for=\"stop_showing\"><input type=\"checkbox\" id=\"stop_showing\" style=\"margin-right: 3px\" />Don't show me this again.</label>",
            
     title: "Welcome to Humanoid Template Designer",
     description: $('#intro').html(),

     id: "intro",
     //next: 'title',

     overlay: true,
     width: 800      
   }).show();
  },
  
  introClosed: function() {
    if( $("#stop_showing").is(':checked') ) {
      // Don't show any more guiders
      for( var i in this.shownGuiders ) {
        if( this.shownGuiders.hasOwnProperty(i) ) {
          this.shownGuiders[i] = true;
        }
      }
      
      // Update the server
      $.post('/developer/tutorial_off');
      
      guiders.hideAll();
    } else {
      //guiders.next();
      //this.bindClickDismisser();
      guiders.hideAll();
    }
  },
  
  'accordion.item-changed subscribe': function(message, item) {
    var step = item.replace('step-', '');
    
    if( step !== 'title' && ! this.shownGuiders[step] ) {
      this.shownGuiders[step] = true;
      guiders.show(step);
      this.bindClickDismisser();
    }
  },
  
  /*
   * Dismiss any guider by clicking outside of it 
   */
  bindClickDismisser: function() {
    $(window).click( function(ev) {
      if( $(ev.target).parents('.guider').length == 0 ) {
        $(window).unbind('click');
        guiders.hideAll();
      }
    });
  }
});

});

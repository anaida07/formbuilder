steal( './views/error.ejs', './views/good.ejs' ).then( function($) {

/**
 * @class WizardFormBuilder.Controllers.ErrorCheck
 */
 
$.Controller('WizardFormBuilder.ErrorCheck',
/* @Static */
{

},
/* @Prototype */
{
  init: function() {
    this.show();
  },
  
  'form_item.updated subscribe': function(message, item) {
    this.show();
  },
  
  'accordion.item-changed subscribe': function(message, item) {
    this.show();
  },
  
  show: function() {
    /* Ugly */
    var form = this.options.form.controller().form;
    
    if( ! form )
      return;
      
    // The accordion will set an absolute height on this content, we need to fix that
    this.element.height('');
      
    // Find all items that should have a 'name' attribute
    var dynamic_items = form.items.grep( function(item) { return item.Class.TYPE == 'task' || item.Class.TYPE == 'data' });
    
    // Find all of these items whose name is blank or unset
    var without_name = dynamic_items.grep( function(item) { return typeof item.attr('name') != 'string' || item.attr('name').match(/^\s*$/) } )

    if( without_name.length > 0 ) {
      this.element.html(this.view('error', {elements: without_name}));
    } else {
      this.element.html(this.view('good'));
    }
  }
  
});

});
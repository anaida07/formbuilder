/**
 * @class WizardFormBuilder.ComponentLibrary
 */
 
$.Controller('WizardFormBuilder.ComponentLibrary',
/* @Static */
{
  // These are not 'normal DOM events' apparently
  listensTo: ['dragstart']
},
/* @Prototype */
{
  init: function() {
    // Setup component library
    var cl = this.element;

    // Add all form fields to component library
    $.each(this.options.models, function(idx, klass) {
      cl.append( klass.asDraggable() );
    });
  },

  // This only catches drag events from the component library
  '.form-draggable dragstart': function(el, ev) {
    var dt = ev.originalEvent.dataTransfer;
    
    // We are making a copy of the library element to put it in the form
    dt.dragEffect = 'copy';
  
    // Store the element's HTML in the dataTransfer object
    dt.setData('text/html', $('<div/>').append($(ev.target).clone()).html());
  },
  
  '.form-draggable click': function(el, ev) {
    OpenAjax.hub.publish('form_item.do_add', el.data('class'));
  }
});




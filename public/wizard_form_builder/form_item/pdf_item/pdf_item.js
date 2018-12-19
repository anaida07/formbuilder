steal('./views/show.ejs', './views/properties.ejs').then( function($) {

WizardFormBuilder.FormItem.extend('WizardFormBuilder.FormItem.PdfItem', 
/* STATIC */
{

},
/* PROTOTYPE */
{
  
  redraw: function() {
    this.element.find('.main')
      .width(this.model.attr('width'))
      .height(this.model.attr('height'));
  },
  
  value: function(val) {
    if( typeof val !== 'string')
      val = '';

    this.element.find('.text').html(val.replace(/\n/g, "<br>"));
  }
   
});

});
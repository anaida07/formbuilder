steal('./views/show.ejs', './views/properties.ejs').then( function($) {

WizardFormBuilder.FormItem.extend('WizardFormBuilder.FormItem.DynamicTextItem', 
/* STATIC */
{

},
/* PROTOTYPE */
{
  
  redraw: function() {
    this.element.find('.text')
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
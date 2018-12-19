steal('./views/show.ejs', './views/properties.ejs').then( function($) {

WizardFormBuilder.FormItem.extend('WizardFormBuilder.FormItem.TitleItem', 
/* STATIC */
{
},
/* PROTOTYPE */
{
  redraw: function() {
    // This item is the width of the form
    var padding = this.element.outerWidth() - this.element.width();
    this.element.width( this.model.form.elements().width() - padding );
  }
  
});

});
steal('./views/show.ejs', './views/properties.ejs').then( function($) {

WizardFormBuilder.FormItem.extend('WizardFormBuilder.FormItem.StaticTextItem', 
/* STATIC */
{
},
/* PROTOTYPE */
{
  redraw: function() {
    this.element.width( this.model.attr('width') )
                .height( this.model.attr('height') )
    .find('.content-area').width( this.model.attr('width') )
                          .height( this.model.attr('height') )
                          .css('overflow','auto');
  }  
});

});
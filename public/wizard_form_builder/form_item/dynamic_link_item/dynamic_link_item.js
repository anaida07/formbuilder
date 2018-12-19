steal('./views/show.ejs', './views/properties.ejs').then( function($) {

WizardFormBuilder.FormItem.extend('WizardFormBuilder.FormItem.DynamicLinkItem', 
/* STATIC */
{
},
/* PROTOTYPE */
{
  redraw: function() {
    this.element.width(this.model.attr('width'));
  },
  
  value: function(val) {
    // Make sure they have http:// at the start of links
    if( ! val.match(/^https?:\/\//) ) {
      val = 'http://' + val;
    }

    this.element.find('a').attr('href', val)
                          .html(val);
  }
  
});

});

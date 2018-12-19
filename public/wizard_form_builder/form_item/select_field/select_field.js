steal('./views/show.ejs', './views/properties.ejs').then( function($) {

WizardFormBuilder.FormItem.extend('WizardFormBuilder.FormItem.SelectField',
/* STATIC */
{
},
/* PROTOTYPE */
{
  value: function(val) {
      this.element.find('select').val(val);
  },

  redraw: function() {
    this.add_tooltip();
  },

  /**
   * Freeze this field (make it uneditable)
   */
  freeze: function() {
    this.element.find('select').attr('disabled', 'disabled');

    if( this.options.jobtype == 'review' ) {
      this._flagState.status = 'frozen';
      this.element.removeClass('review');
    }
  }

});

});

steal('./views/show.ejs', './views/properties.ejs').then( function($) {

WizardFormBuilder.FormItem.extend('WizardFormBuilder.FormItem.CheckBox',
/* STATIC */
{
  // Value of checkbox when clicked
  VAL: 1
},
/* PROTOTYPE */
{

  value: function(val) {
    if( val == this.Class.VAL ) {
      this.element.find('input').prop('checked', 'checked');
    } else {
      this.element.find('input').prop('checked', '');
    }
  },

  redraw: function() {
    this.add_tooltip();
  },

  /**
   * Freeze this field (make it uneditable)
   */
  freeze: function() {
    this.element.find('input').attr('disabled', 'disabled');

    if( this.options.jobtype == 'review' ) {
      this._flagState.status = 'frozen';
      this.element.removeClass('review');
    }
  }

});

});

steal('./views/show.ejs', './views/properties.ejs').then( function($) {

WizardFormBuilder.FormItem.extend('WizardFormBuilder.FormItem.TextField',
/* STATIC */
{
},
/* PROTOTYPE */
{
  redraw: function() {
    this.add_tooltip();
    this.element.find('.value').width( this.model.attr('width') );
    this.element.children('label').width(this.model.attr('width'));
  },

  // Set the value of this component for the content or review job
  value: function(val) {
    var el = this.element.find('.value');
    el.is('input') ? el.val(val) : el.html(val);
  },

  /**
   * Freeze this field (make it uneditable)
   */
  freeze: function() {
    if( this.options.jobtype == 'review' ) {
      this._flagState.status = 'frozen';
      this.element.removeClass('review');
    } else {
      this.element.find('input').attr('disabled', 'disabled');
    }
  }

});

});

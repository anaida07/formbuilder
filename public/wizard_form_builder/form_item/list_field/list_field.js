steal('./views/show.ejs', './views/properties.ejs').then( function($) {

/**
 * @class WizardFormBuilder.FormItem.ListField
 *
 * Represents an array of fields that function as a single input.
 * This controller is slightly hacky because I use it in the form and in the property
 * inspector
 */

WizardFormBuilder.FormItem.extend('WizardFormBuilder.FormItem.ListField',
/* @Static */
{

},
/* @Prototype */
{
  list: null,

  init: function() {
    // A bit hacky, allow this to be used as a widget in the property inspector
    if( this.options.list_model ) {
      this.element.model(this.options.list_model);
      this.list = this.options.model.attr(this.options.list_model.attr('name'));
    }

    this._super();
  },

  value: function( val ) {
    if( typeof val == 'undefined' ) {
      return this.getValue();
    } else {
      return this.setValue(val);
    }
  },

  redraw: function() {
    this.add_tooltip();
  },

  // Returns an Array of Objects
  // Each object corresponds to one row in the table
  getValue: function() {
    var value = this.element.find('tbody tr').map( function() {

      var obj = {};

      // Turn params that look like list[][name] = value
      // into a javascript object {name: value}
      $(this).find('input').each( function() {
        obj[ $(this).attr('name').match(/\[\]\[(.+?)\]/)[1] ] = $(this).val();
      });

      return obj;
    });

    // select non-blank params
    value = value.filter( function(idx, obj, arr) {
      for( var prop in obj ) {
        if( ! /^(\s+)?$/.test( obj[prop] ) ) {
          return true;
        }
      }
      return false;
    });

    // make sure we have an array, not a jQuery object
    value = value.toArray();

    return value;
  },

  setValue: function( val ) {
    if( typeof val === 'object' ) {
      this.list = val;
      this.element.trigger('needs_redraw');
    }
  },

  '.add-one-more click': function(el, ev) {
    ev.preventDefault();

    // Add another line to the array
    var last_tr = this.element.find('tr').last();

    var new_tr = last_tr.clone().find('input').val('').end();

    last_tr.after(new_tr);

    return false;
  },

  '.delete click': function(el, ev) {
    // Remove this row, only if it's not the last row
    if( this.find('tbody tr').length != 1 ) {
      el.closest('tr').remove();
    }

    // Notify people that this shit changed
    this.element.find('input:first-child').trigger('change');
  }

});

});

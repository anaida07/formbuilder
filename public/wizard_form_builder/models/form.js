/**
 * @tag models, home
 * Wraps backend form services.  Enables
 * [WizardFormBuilder.Models.Form.static.findAll retrieving],
 * [WizardFormBuilder.Models.Form.static.update updating],
 * [WizardFormBuilder.Models.Form.static.destroy destroying], and
 * [WizardFormBuilder.Models.Form.static.create creating] forms.
 */
$.Model('WizardFormBuilder.Models.Form',
/* @Static */
{
  /**
   * Retrieves form data from your backend services.
   * @param {Object} params params that might refine your results.
   * @param {Function} success a callback function that returns wrapped form objects.
   * @param {Function} error a callback function for an error in the ajax request.
   */
  findOne: function(params, success, error) {
    var id = params.id;
    delete params.id;

    return $.ajax({
      url: '/forms/' + id,
      type: 'get',
      dataType: 'json form.model',
      data: params,
      success: this.callback(['instantiateItems', success]),
      error: error
    });
  },

  instantiateItems: function(form) {
    if( typeof form.items !== 'undefined' ) {
      var oldItems = form.items;
      form.items = new $.Model.List;

      $.each(oldItems, function() {
        var type = this.type;
        delete this.type;

        var item_type = WizardFormBuilder.Models[type];

        if( typeof item_type == 'undefined' ) {
          steal.dev.log('Unrecognized item type: ' + item_type);
          return;
        }

        var item = item_type.model(this);
        item.form = form;
        form.items.push( item );
      });
    }
  }
},
/* @Prototype */
{
  /* Return the lowest and highest x and y coordinates of THE INSIDE OF this element */
  inner_constraints: function() {
    return {
      lowX: 0,
      lowY: 0,
      highX: this.elements().width(),
      highY: this.elements().height()
    };
  },

  /* Add this item to the list of this form's items, and render it */
  addItem: function(item) {
    this.items.push(item);
    item.form = this;
  },

  removeItem: function(item) {
    this.items.remove( item );
    item.form = null;
  },

  findItemByName: function(name) {
    for( var i = 0; i < this.items.length; i++ ) {
      var item = this.items[i];
      if( item.attr('name') == name )
        return item;
    }

    steal.dev.log("Could not find item with name " + name)
    return null;
  },

  validationTypes: function(){
    /** List of validation types for text_field and text_area **/
    var validation_types = {
      'Alphabet' : 'alphabet',
      'Alphanumeric' : 'alphanumeric',
      'Email' : 'email',
      'Integer' : 'integer',
      'Number' : 'number',
      'URL' : 'url',
      'US Phone Number' : 'us_phone_number',
      'US Zip Code' : 'us_zip_code'
    };
    return validation_types;
  }
}
);

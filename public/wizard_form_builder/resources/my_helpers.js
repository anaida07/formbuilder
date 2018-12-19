$.extend($.EJS.Helpers.prototype, {

  select_property: function(object, name, label, description, options) {
    if( typeof label === 'undefined' ) {
      label = $.String.capitalize(name);
    }
    var arr = [];
    arr.push( this.label_tag(label, {'for': name, 'class': 'top'}) );

    if( typeof description != 'undefined' )
      arr.push( '<p class="small">' + description + '</p>' );

      arr.push( this.select_tag(name, object[name], options) );

    return arr.join('');
  },

  string_property: function(object, name, label, description, options) {
    if( typeof label === 'undefined' ) {
      label = $.String.capitalize(name);
    }

    if( typeof description != 'undefined' )
      label += ' <img class="tooltip" src="/images/humanoid/question.png" title="' + description + '" style="vertical-align: -3px; margin-left: 2px;"/>'

    var arr = [];
    arr.push( this.label_tag(label, {'for': name, 'class': 'top'}) );
    if (typeof options != 'undefined'){
    	arr.push( this.text_field_tag(name, object[name], options) );
    } else {
    	arr.push( this.text_field_tag(name, object[name]) );
    }

    return arr.join('');
  },

  name_property: function(object, readonly) {
    var options = (typeof readonly != 'undefined') ? {'readonly': true} : {};
    return this.string_property(object, 'name', 'Field Name', 'The header for the column in your spreadsheet which contains data for this widget. Must be unique, cannot contain spaces.', options);
  }

});

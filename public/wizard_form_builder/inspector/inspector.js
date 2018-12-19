/**
 * @class WizardFormBuilder.Inspector
 */

$.Controller('WizardFormBuilder.Inspector',
/* @Static */
{

},
/* @Prototype */
{
  field: null,

  appear: function() {
    $('li#inspector-tab').click();
  },

  disappear: function(message) {
    this.element.find('#property_sheet').html(message)
    $('li#library-tab').click();
  },

  '.close click': function() {
    OpenAjax.hub.publish('fields.deactivate_all');
  },

  load_property_sheet: function(field) {
    var klass = $.String.underscore(field.Class.shortName);
    var inspector = this;
    this.element.find(".remove").remove();
    this.element.find("#property_sheet").html(' ')
      .html( '//wizard_form_builder/form_item/' + klass + '/views/properties.ejs', {field: field}, function(result) {
        this.append( $('<input/>').addClass('remove button').attr('type', 'submit').val("\u2716 Remove Item") );

        // Don't set this model's field till the property sheet actually loads.
        // The reason is, the departing property sheet may trigger a change event that
        // we want to trigger on the current field
        inspector.field = field;
      })

    this.element.find('#fieldtype').text(field.Class.displayName);

    this.appear();
    this.load_range_block(field);
    this.controlValidationField(field);
  },

  'fields.active subscribe': function(message, fields) {
    if( fields.length == 1 ) {
      this.load_property_sheet(fields[0]);
    } else {
      fields.length == 0 ? this.disappear('No field selected.') : this.disappear('Multiple fields selected.');
    }
  },

  '#name keydown' : function(el, ev) {
    if (ev.which == 32) {
      return false;
    }
  },

  'select focus': function(el, ev) {
      var value = el.val(),
      name = el.attr('name');

      this.field.attr(name, value, function() {
        // On success, re-set this form field
        el.val(this.attr(name));
        this.save();
      }, function() {
        // On error, re-set this form field
        el.val(this.attr(name));
      });
  },

  'input,textarea,select change': function(el, ev) {
    var value = el.val(),
        name = el.attr('name');
    if( el.attr('type') == 'checkbox' ) {
      // Turn checkboxes into true or false
      value = el.is(':checked');
    } else if( /\[.*?\]$/.test(el.attr('name')) ) {
      // This is an array input field
      value = el.closest('div:not(.content-area)').controller().value();
      name = el.attr('name').replace(/\[.*?\]$/g, '');
    }

    this.field.attr(name, value, function() {
      // On success, re-set this form field in case the value changed as it was set
      if( ! /\[.*?\]/.test(el.attr('name')) && el.attr('type') != 'radio' ) {
        el.val(this.attr(name));
      }
      if (el.is("#name")) {
        this.name = el.val().toLowerCase();
      }
      this.save();
    }, function() {
      // On error, re-set this form field
      if( ! /\[.*?\]/.test(el.attr('name')) && el.attr('type') != 'radio' ) {
        el.val(this.attr(name));
      }
    });
    this.load_range_block(this.field);
  },

  ':input[name="validation_style"] change' : function(el, ev) {
    var val = el.val();
    var custom_validation = $("#custom_validation_wrap");
    var standard_validation = $("#validation_type_wrapper");

    custom_validation.hide();
    standard_validation.hide()
    if(val == 'standard') {
      standard_validation.show()
      return void 0;
    }
    custom_validation.show()
  },

  '#show_thumbnail_no, #multiple_false, #thumbnail_position_horizontal, #multiple_true change' : function(el, ev) {
    $("#width").removeAttr('disabled');
    $("#height").removeAttr('disabled');
    if(el.is("#multiple_true")) {
      $("#show_thumbnail_no").click();
    }
  },

  ':input[name="range_min"],:input[name="range_max"] keypress': function(el, ev) {
    var validationType = $('#validation_type').val();
    var keyCode = ev.which;
    var val = el.val().trim();
    if (validationType == 'number' || validationType == 'integer') {
      if(keyCode == 189 || keyCode == 45) {
        if(val.indexOf("-") == -1) {
          return true;
        }
      }
    };
    return !(keyCode>31 && (keyCode<48 || keyCode>57));
  },

  ':input[name="range_min"],:input[name="range_max"] keyup' : function (el, ev) {
     var elem = el;
     var value = el.val();
     var parent = el.parents('div.elem');
     var min = parent.find('#range_min').val().trim();
     var max = parent.find('#range_max').val().trim();
     if(max == '') {
       parent.find("div.error").remove();
       return void 0;
     }
     if(+min > +max) {
        if(!(parent.find("div.error").length > 0)){
          parent.append("<div class='error'><span class='error'>min value is greater than max value.</span></div>");
        }
     } else {
        parent.find("div.error").remove();
     }
  },

  ':input.pdf_width focusout' : function (el, ev) {
    var value = el.val();
    var parent = el.parents('div.elem');
    var min_width = 410;
    if(value < min_width) {
      if(!(parent.find("div.error").length > 0)){
        parent.append("<div class='error'><span class='error'>Width of pdf should be greater than " + min_width + ".</span></div>");
      }
      el.val(min_width);
      this.field.width = min_width;
      this.field.save();
    } else {
      parent.find("div.error").remove();
    }
  },

  'form_item.updated subscribe': function(message, data) {
    if( data.field == this.field ) {
      // This doesn't trigger a change event or we'd be in trouble!
      var item = this.element.find('input[name=' + data.name + ']').add('textarea[name=' + data.name + ']');
      if( item.attr('type') !== 'radio' ) {
        item.val(data.val);
      }
    }
  },

  '.remove click': function(el, ev) {
    this.field.destroy();
  },

  'form keypress': function(el, ev) {
    // return functions like tab in the form
    if( ev.charCode == 13 && ! $(ev.target).is('textarea') ) {
      ev.preventDefault();
      $(ev.target).nextAll('input').first().focus();
      return false;
    }
  },

  'form submit': function(el, ev) {
    ev.preventDefault();
    return false;
  },

  'load_range_block': function(el){
    if(el.type == "ImageItem") {
      this.handleImageField(el);
      return;
    }
    $('#range_wrap').show();
    var validation_types_for_range = ['number', 'alphabet', 'integer', 'alphanumeric'];
    var format = el.format;

    /** Different format choices for different validation types. **/
    var format_choices = {
      'number' : {
        'Value' : 'number_value'
      },
      'alphabet' : {
        'Characters' : 'characters',
        'Words' : 'words'
      },
      'alphanumeric' : {
        'Characters' : 'characters'
      },
      'regex' : {
        'Characters' : 'characters'
      }
    }

    if(el.validation_style == "custom") {
      this.buildOptions(format_choices['regex'], format);
      return void 0;
    } else {
      if(el.validation_type && $.inArray(el.validation_type, validation_types_for_range) !== -1){
        /** Show range block only for 'Number', 'Alphabet', 'Alphanumeric' and 'Integer' validation type. **/
        this.buildOptions(format_choices[el.validation_type], format);
      } else {
        this.hideControlFields(el);
      }
    }
    el.save();
  },

  hideControlFields : function(el) {
    el.range_min = '';
    el.range_max = '';
    el.format = '';
    $('#range_wrap').hide();
  },

  controlValidationField : function (el) {
    var custom_validation = $("#custom_validation_wrap"),
        standard_validation = $("#validation_type_wrapper");
    custom_validation.hide();
    standard_validation.hide();
    if(el.validation_style == 'standard') {
      standard_validation.show();
    } else if(el.validation_style == "custom") {
      custom_validation.show();
    }
  },

  buildOptions : function (format_choices, format) {
    format = format || ''
    var choices = [];
    $.each(format_choices, function(key, value){
      var option = $('<option></option>');
      option.attr('value',value)
            .text(key);
      if(value === format)
        option.attr('selected', 'selected')
      choices.push(option[0].outerHTML);
    });
    $('#format').html(choices.join(''));
  },

  handleImageField : function(elem) {
    if(elem.multiple == "true") {
      elem.thumbnail_position = 'horizontal'
      elem.show_thumbnail = 'true'
    }
    elem.save();
  }
});

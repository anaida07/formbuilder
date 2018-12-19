steal( 
  './views/start.ejs',
  './views/items-form.ejs',
  './views/items-results.ejs',
  './views/json-form.ejs',
  './views/json-results.ejs'
).then( function($) {

/**
 * @class WizardFormBuilder.Sandbox
 */
 
$.Controller('WizardFormBuilder.Sandbox',
/* @Static */
{

},
/* @Prototype */
{ 
  init: function() {
    this.start();
  },
  
  update: function(options) {
    this._super(options);
    this.start();
  },
  
  start: function() {
    this.element.html(this.view('start'));
  },
  
  'a.back click': function(el, ev) {
    this.element.html(this.view('start'));
  },
  
  'a.test-link click': function(el, ev) {
    ev.preventDefault();
    if( el.attr('id') == 'test-with-json' ) { this.showJSONForm(); }
    else if( el.attr('id') == 'test-with-form' ) { this.showItemsForm(); }
  },
  
  'a.start-over click': function(el, ev) {
    if( this.inputMethod == 'json' ) { this.showJSONForm(); }
    else { this.showItemsForm(); }
  },
  
  showJSONForm: function() {
    this.inputMethod = 'json';
    
    this.element.html(this.view('json-form'));
    
    var json = {};
    
    this.options.form.items.match('accepts_data', true).each( function() {
      json[this.name] = this.valueHelper();
    });
    
    // Use 4 spaces for indentation, makes it pretty-print
    $('#json').val( $.toJSON(json, null, 4) );
  },
  
  showItemsForm: function() {
    this.inputMethod = 'items';
    this.element.html(this.view('items-form'));
  },
  
  '#json-sandbox-input submit': function(el, ev) {
    ev.preventDefault();
    
    var json_string = $('#json').val();
    try {
      var json = JSON.parse(json_string);
      this.showFormWithData(json);
    } catch( e ) {
      this.element.find('.error').hide()
                                 .html('There was an error in your JSON. Please fix it and try again.')
                                 .fadeIn();

      var controller = this;
      if( this.errorTimeout ) clearTimeout(this.errorTimeout);
      this.errorTimeout = setTimeout( function() { controller.element.find('.error').fadeOut(); }, 2000 );
    }
  },
  
  '#items-sandbox-input submit': function(el, ev) {
    ev.preventDefault();
    this.showFormWithData( el.formParams(false) );
  },
  
  showFormWithData: function(data) {
    var controller = this;
    
    this.element.hide();
    this.options.form.elements().form_builder_form({mode: 'performable', data: data});
                        
    this.options.form.elements().find('input[type=submit]').one('click', function() { controller.sandboxSubmit() } );
  },
  
  sandboxSubmit: function() {
    var formParams = this.options.form.elements().formParams(false);  // Don't try to parse numbers or booleans
    
    // formParams won't get list elements right, so swap those out
    this.options.form.items.match('type', 'ListField').each( function() {
      formParams[this.attr('name')] = this.elements().controller().value();
    });
    
    this.options.form.elements().hide();
    
    this.element.show()
                .html(this.view( this.inputMethod + '-results', {results: formParams} ));
  }
  
});

});
if( steal.options.env == 'test' ) {
  
  steal( 'jquery/dom/fixture', function() {
    $.fixture('/forms/1', 'fixtures/form.json.get');
  });
  
}
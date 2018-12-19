// load('wizard_form_builder/scripts/crawl.js')

load('steal/rhino/rhino.js')

steal('steal/html/crawl', function(){
  steal.html.crawl("wizard_form_builder/form_builder.html","wizard_form_builder/out")
});

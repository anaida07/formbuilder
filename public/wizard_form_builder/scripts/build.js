//steal/js wizard_form_builder/scripts/compress.js

load("steal/rhino/rhino.js");
steal('steal/build').then('steal/build/scripts','steal/build/styles',function(){
  steal.build('wizard_form_builder/scripts/build.html',{to: 'form_builder'});
});

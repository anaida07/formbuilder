//js wizard_form_builder/scripts/doc.js

load('steal/rhino/rhino.js');
steal("documentjs").then(function(){
  DocumentJS('wizard_form_builder/form_builder.html', {
    markdown : ['form_builder']
  });
});
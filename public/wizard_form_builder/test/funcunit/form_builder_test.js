module("form_builder test", { 
  setup: function(){
    S.open("//wizard_form_builder/form_builder.html");
  }
});

test("Initialization", function(){
  equals( S("#explain").text(), "Drag components here to build a factory.", "empty form text" );
  equals( S('#task-list h2').text(), "Factory Builder", 'factory builder header' );
  equals( S('#inspector h2').text(), "Component Editor", 'inspector header' );
});
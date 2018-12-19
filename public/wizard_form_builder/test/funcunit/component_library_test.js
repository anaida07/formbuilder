module("component_library test");

var cl = S('#task-builder');

test("Initialization", function(){
  equals( cl.find('ul li:first-child a').text(), 'Materials');
  equals( cl.find('ul li:nth-child(2) a').text(), 'Tasks');
  equals( cl.find('ul li:nth-child(3) a').text(), 'Instructions');
});
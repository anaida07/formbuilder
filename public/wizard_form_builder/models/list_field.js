WizardFormBuilder.Models.InputItem.extend('WizardFormBuilder.Models.ListField',
/* @static */
{
  defaults: {
    name: '',
    label: 'List',
    columns: [{name: 'c1', label: 'Column 1'}, {name: 'c2', label: 'Column 2'}],
    start_rows: 5
  },
  
  displayName: "List",
  
  tooltip: "Have the worker gather a list of items from the items you provide. Ex. If you provide an image with ingredients the list widget can be used to gather each ingredient."
    
},
/* @prototype */
{
  
});

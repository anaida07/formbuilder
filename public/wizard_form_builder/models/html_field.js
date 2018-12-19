WizardFormBuilder.Models.DataItem.extend('WizardFormBuilder.Models.HtmlField',
/* @static */
{
  defaults: {
    name: '',
    label: 'Web Page',
    width: 300,
    height: 170
  },
  
  displayName: 'Web Page',
  
  resizable: ['nw', 'ne', 'se', 'sw'],

  tooltip: "Embed a web page into the worker form. Ex. If you have one web site from which you want a worker to extract information from."
  
},
/* @prototype */
{
  valueHelper: function() {
    return "Web Page URL";
  } 
});

WizardFormBuilder.Models.DataItem.extend('WizardFormBuilder.Models.DynamicLinkItem',
/* @static */
{
  defaults: {
    width: 250,
    label: 'Link'
  },
  
  displayName: 'Link',
  tooltip: "A link to a website. Ex. if you have multiple websites from which you want to extract information you can provide the links to the worker."
  
},
/* @prototype */
{
  valueHelper: function() {
    return 'Link URL';
  }

});

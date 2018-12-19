WizardFormBuilder.Models.DataItem.extend('WizardFormBuilder.Models.DynamicTextItem',
/* @static */
{
  defaults: {
    width: 250,
    height: 180,
    label: 'Text'
  },
  
  displayName: 'Text',
  
  resizable: ['nw', 'ne', 'se', 'sw'],

  tooltip: "If you want to provide the worker with text from which to extract information. Ex. Pull out the nouns from a block of text."
},
/* @prototype */
{
  valueHelper: function() {
    return 'Text';
  }
  
});

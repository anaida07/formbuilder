WizardFormBuilder.Models.DataItem.extend('WizardFormBuilder.Models.ImageItem',
/* @static */
{
  defaults: {
    width: 240,
    height: 320,
    multiple: 'false',
    label: 'Image'
  },
  
  displayName: 'Image',
  
  resizable: ['nw', 'ne', 'se', 'sw'],

  tooltip: "Provide the worker with an image/picture from which you want to gather information."
},
/* @prototype */
{  
   valueHelper: function() {
     return this.multiple === 'true' ? ["Image URL 1", "Image URL 2"] : 'Image URL'
   }

});

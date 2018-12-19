WizardFormBuilder.Models.DataItem.extend('WizardFormBuilder.Models.PdfItem',
/* @static */
{
  defaults: {
    width: 600,
    height: 500,
    label: 'Pdf'
  },
  
  displayName: 'Pdf',
  
  resizable: ['nw', 'ne', 'se', 'sw'],

  tooltip: "If you want to provide the worker with Pdf from which to extract information."
},
/* @prototype */
{
  valueHelper: function() {
    return 'Pdf URL'
  }
  
});

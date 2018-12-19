/**
  * DataItem - Base class for data elements. 
  */
  
WizardFormBuilder.Models.FormItem.extend('WizardFormBuilder.Models.DataItem',
/* @static */
{
  TYPE: 'data'
},
/* @prototype */
{
  // This item accepts data to display
  accepts_data: true,
  
  /*
   * Helps the user to know what kind of data to put in the live test field
   */
  valueHelper: function() {
    return '';
  }
  
});
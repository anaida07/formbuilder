/**
  * InputItem - Base class for input elements. 
  */
  
WizardFormBuilder.Models.FormItem.extend('WizardFormBuilder.Models.InputItem',
/* @static */
{
  TYPE: 'task'
},
/* @prototype */
{
  // This item is reviewable (i.e. it can be flagged by the worker)
  reviewable: true
  
});
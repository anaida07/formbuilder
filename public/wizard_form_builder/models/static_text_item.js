WizardFormBuilder.Models.FormItem.extend('WizardFormBuilder.Models.StaticTextItem',
/* @static */
{
  defaults: {
    text: 'Your instruction goes here.',
    width: 400,
    height: 50
  },
  
  displayName: 'Instructions',
  
  resizable: ['nw', 'sw', 'se', 'ne'],

  tooltip: "Instructions give the worker an explaination of what to do on the task. The clearer the instructions the better the results will be."
},
/* @prototype */
{

});

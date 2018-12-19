WizardFormBuilder.Models.InputItem.extend('WizardFormBuilder.Models.CheckBox',
/* @static */
{
  
  defaults: {
    name: '',
    label: 'Check Box',
    choices: [{value: '0', label: 'Choice 0'},
              {value: '1', label: 'Choice 1'},
              {value: '2', label: 'Choice 2'}]
  },
  
  displayName: 'Check Box',

  tooltip: "A widget which allows the worker to confirm or unconfirm an attribute. Ex. If you provide an images which might contain cats the checkbox can ask if an individual image has a cat."

},
/* @prototype */
{

});

WizardFormBuilder.Models.InputItem.extend('WizardFormBuilder.Models.RadioButton',
/* @static */
{
  defaults: {
    name: '',
    label: 'Radio Button',
    choices: [{value: '0', label: 'Choice 0'},
              {value: '1', label: 'Choice 1'}, 
              {value: '2', label: 'Choice 2'}]
  },
  
  displayName: 'Radio Button',

  tooltip: "Have the worker select one of multiple choices. Ex. If you provide images with cats, horses, and planes the multiple choice widget can be used to select what item the image contains."
  
},
/* @prototype */
{
  
});

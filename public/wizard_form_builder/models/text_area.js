WizardFormBuilder.Models.InputItem.extend('WizardFormBuilder.Models.TextArea',
/* @static */
{
  defaults: {
    name: '',
    label: 'Text Area',
    width: 300,
    height: 170,
    placeholder: '',
    exact: 'false'
  },
  
  displayName: 'Text Area',
  
  resizable: ['nw', 'ne', 'se', 'sw'],

  tooltip: "A way to gather a large chunk of text from a worker. Ex. Can be used to copy text from an image."
  
},
/* @prototype */
{
  init: function() {
    this._super();
    
    /* This field is subflaggable if there is an exact answer */
    if( this.attr('exact') === 'true' ) {
      this.subFlag = true;
    }
  }
  
});

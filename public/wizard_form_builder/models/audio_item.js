WizardFormBuilder.Models.DataItem.extend('WizardFormBuilder.Models.AudioItem',
/* @static */
{
  
  
  defaults: {
    name: '',
    label: 'Audio',
    autoplay: false,
    repeat: false
  },

  displayName: 'Audio',

  tooltip: "Provide the worker with an audio, sound, song or etc. Ex. You want to transcribe audio into text the Audio widget is the input."
},
/* @prototype */
{
  valueHelper: function() {
    return "MP3 URL";
  }

});

steal('./views/main.ejs', function($){

/**
 * @class WizardFormBuilder.Main
 */

$.Controller('WizardFormBuilder.Main',
/* @Static */
{
},
/* @Prototype */
{
  init: function() {
    // Insert the main view code into the DOM
    $('#factory-builder').html( this.view('main') );

    // Initialize the Component Libraries
    $('#cl-title').wizard_form_builder_component_library({
      models: [WizardFormBuilder.Models.TitleItem,
               WizardFormBuilder.Models.StaticTextItem]
    });

    $('#cl-data-source').wizard_form_builder_component_library({
      models: [WizardFormBuilder.Models.ImageItem,
               WizardFormBuilder.Models.PdfItem,
               WizardFormBuilder.Models.DynamicTextItem,
               WizardFormBuilder.Models.DynamicLinkItem,
               WizardFormBuilder.Models.HtmlField,
               WizardFormBuilder.Models.AudioItem]
    });

    $('#cl-task').wizard_form_builder_component_library({
      models: [WizardFormBuilder.Models.TextField,
               WizardFormBuilder.Models.TextArea,
               WizardFormBuilder.Models.CheckBox,
               WizardFormBuilder.Models.RadioButton,
               WizardFormBuilder.Models.SelectField,
               WizardFormBuilder.Models.ListField]
               //WizardFormBuilder.Models.ImageTagging]
    });

    // Initialize the form, inspector, and tabs controllers
    var form = $('#job-form').wizard_form_builder_form(window.form_options),
        inspector = $('#inspector').wizard_form_builder_inspector(),
        tabs = $('#tabs').wizard_form_builder_tabs();

    // Provide editing in place for the template name.
    $("#template-name").editInPlace({
      callback: function(unused, enteredText) {
        $.ajax({
           type: "POST",
           url: "/templates/" + template_id + "/update_title",
           data: "new_title=" + enteredText,
           success: function(msg) {}
        });
        if (enteredText == "")
        {
          if( $('.title-error').length < 1 )
            $("#main-container").prepend('<div class="error title-error">Template name cannot be empty.</div>');
        }
        else
        {
          $.data(this, "current", enteredText);
          $('.title-error').fadeOut(300, function(){ $(this).remove() });
        }
        return enteredText == "" ? $(this).data("current") : enteredText;
      }
    });

    this.load_iframe_preview = function(){
      this.mode = 'preview';
      if($("#form-preview-frame-wrapper").length < 1){
        $('#job-form').height(600);
        $("#job-form").width(800);
        $('#job-form').html(
          "<div id='form-preview-frame-wrapper'><iframe id='form-preview-frame' src='/forms/" +
          form_options.form_id +
          "/preview'></iframe></div>"
          );
      }
    };

    // Not required
    // Scan for vimeo stuff
    // if (typeof activateVimeoTracking == 'function') {
    //   activateVimeoTracking();
    // }
  },

  '#edit-link click': function(el, ev) {
    ev.preventDefault();
    $('.side-column').show();
    $('#job-form .explainer').hide();
    $('#main-container').addClass('wide');
    $('li#library-tab').click();
  },

  '.edit-tab click': function(el, ev) {
    if( this.mode == 'preview' ) {
      $('#job-form').wizard_form_builder_form({mode: 'editable'});
      this.mode = 'editable';
    }
  },

  '#edit_preview_btn click': function(el, ev) {
    ev.preventDefault();
    // lets animate the side bar
    //make form editable & change next-mode to preview
    var sideColum = $('.side-column');
    var jobFormWrap = $('.job_form_wrap');
    var jobForm = $('#job-form');
    var self = this;

    if (el.hasClass('to_edit_mode')) {
      el.removeClass('to_edit_mode');
      jobFormWrap.stop().animate({
        'margin-left': '250px',
        queue: false
      }, 400, function() {
        self.mode = 'editable';
        jobForm.wizard_form_builder_form({mode: self.mode});
        el.html('<i class="fa fa-flash"></i>').attr('title', 'Quick Preview').addClass('to_preview_mode');
        $('#library-tab').click();
      });
      sideColum.stop().animate({
        left: '0px',
        queue: false
      }, 400);
    } else {
      el.removeClass('to_preview_mode');
      sideColum.stop().animate({
        left : '-250px'
      }, 400);
      jobFormWrap.stop().animate({
        marginLeft: 0,
        queue: false
      }, 400, function() {
        self.mode = 'preview';
        jobForm.wizard_form_builder_form({mode: self.mode});
        el.html('<i class="fa fa-pencil"></i>').attr('title', 'Edit Form').addClass('to_edit_mode');
      });
    }
  },

  'form_item.saving subscribe': function() {
    $('.finalize_btn').text('Publish*');
    $('.btn-back a').attr('data-confirm-msg', "You haven't finished publishing yet. Do you want to leave without publishing?")
    $('#save-form').addClass('active')
                   .removeClass('error')
                   .text('saving...');
  },

  'form_item.saved subscribe': function() {
    $('#save-form').removeClass('active')
                   .text('saved');
  },

  'form_item.saveFailed subscribe': function() {
    $('#save-form').removeClass('active')
                   .addClass('error')
                   .text('save failed!');
  },

  /* Create/destroyed fail should probably be a notification,
   * not a save button change
   */
  'form_item.createFailed subscribe': function() {
    $('#save-form').removeClass('active')
                   .addClass('error')
                   .text('save failed! please try again.');
  },

  'form_item.destroyFailed subscribe': function() {
    $('#save-form').removeClass('active')
                   .addClass('error')
                   .text('remove failed! please try again.');
  }

});

});

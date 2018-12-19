steal(
  'steal/less',
  'jquery/controller',              // a widget factory
  'jquery/controller/subscribe',    // subscribe to OpenAjax.hub
  'jquery/view/ejs',                // client side templates
  'jquery/view/helpers',
  'jquery/controller/view',         // lookup views with the controller's name
  'jquery/dom/form_params',         // form data helper
  'jquery/lang/json',
  'jquery/event/hover'

).then(

  './models/models.js',
  './fixtures/fixtures.js',

  'wizard_form_builder/main',
  'wizard_form_builder/accordion',
  'wizard_form_builder/component_library',
  'wizard_form_builder/inspector',
  'wizard_form_builder/error_check',
  'wizard_form_builder/tabs',

  'wizard_form_builder/form',
  'wizard_form_builder/form_item',

  /* Styles */
  './styles/form_builder.less',
  './styles/component_library.less',
  './resources/jplayer-2.1.0/jplayer.blue.monday.css',
  './resources/guiders/guiders-1.1.4.css',
  './resources/jcrop/css/jquery.Jcrop.css',

  /* External Libraries that we use */
  './resources/jplayer-2.6.0/jquery.jplayer.min.js',
  './resources/guiders/guiders-1.1.4.js',
  './resources/jcrop/js/jquery.Jcrop.min.js',

  './resources/fancybox/jquery.fancybox-1.3.1.css',
  './resources/fancybox/jquery.fancybox-1.3.1.pack.js',
  './resources/fancybox/jquery.easing-1.3.pack.js',

  './resources/javascripts/jquery.editinplace.js',

  /* Load our application js, fancybox, qual js. Not sure if this is the best place
     for this, but I don't have time to figure out steal right now */
  './resources/javascripts/application',
  './resources/javascripts/factory/qual'

).then(
  // These files depend on things being loaded above

  './resources/util',
  './resources/my_helpers',
  './resources/mouse_move_tracker',

  // Static items
  'wizard_form_builder/form_item/static_text_item',
  'wizard_form_builder/form_item/title_item',

  // Data Items
  'wizard_form_builder/form_item/image_item',
  'wizard_form_builder/form_item/pdf_item',
  'wizard_form_builder/form_item/dynamic_text_item',
  'wizard_form_builder/form_item/dynamic_link_item',
  'wizard_form_builder/form_item/html_field',
  'wizard_form_builder/form_item/audio_item',

  // Input Items
  'wizard_form_builder/form_item/text_field',
  'wizard_form_builder/form_item/text_area',
  'wizard_form_builder/form_item/radio_button',
  'wizard_form_builder/form_item/check_box',
  'wizard_form_builder/form_item/select_field',
  'wizard_form_builder/form_item/list_field',
  'wizard_form_builder/form_item/image_tagging',
  'wizard_form_builder/form_item/segmented_text_area',
  './resources/Markdown.Converter.js'

).then(
  // To load custom css
  './styles/wizard_form_builder.css?' + (new Date).getTime().toString()
).then(
    function($) {
      $(document).wizard_form_builder_main();
      document.getElementsByTagName('body')[0].style.display = 'block';
    }

);

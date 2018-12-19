// Steal all models

steal(

  'jquery/model',
  'jquery/model/list',
  'jquery/model/validations'

).then(

  './form',
  './form_item'

).then(

  './data_item',
  './input_item'

).then(

  // Static items
  './static_text_item',
  './title_item',

  // Data Items
  './image_item',
  './pdf_item',
  './dynamic_text_item',
  './dynamic_link_item',
  './html_field',
  './audio_item',

  // Input Items
  './text_field',
  './text_area',
  './radio_button',
  './check_box',
  './select_field',
  './list_field',
  './image_tagging'

).then(

  './segmented_text_area'

);

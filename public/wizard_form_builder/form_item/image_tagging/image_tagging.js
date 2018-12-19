steal('./views/show.ejs', './views/properties.ejs').then( function($) {

/**
 * @class WizardFormBuilder.FormItem.ImageTagging
 *
 * WHAT DO I DO?!
 */
 
WizardFormBuilder.FormItem.extend('WizardFormBuilder.FormItem.ImageTagging',
/* @Static */
{
  
},
/* @Prototype */
{ 
  
  value: function( val ) {
    // Needs to be implemented for review step
  },
  
  '.add-one-more click': function(el, ev) {
    ev.preventDefault();
    
    // Add another line to the array
    var last_tr = this.element.find('tr').last();
    
    var new_tr = last_tr.clone().find('input').val('').end();

    last_tr.after(new_tr);
    
    return false;
  },
  
  '.delete click': function(el, ev) {
    // Remove this row, only if it's not the last row
    if( this.find('tbody tr').length != 1 ) {
      el.closest('tr').remove();
    }
    
    // Notify people that this shit changed
    this.element.find('input:first-child').trigger('change');
  },

  "input click": function(el, ev) {
    var image = this.model.form.items.match('name', this.model.attr('image'))[0];

    if( image ) {    
      // Associate the image with el. 
      img = image.elements().find("img").last();

      // Don't have clicking on the image bring it up full-size in a new window
      img.parents("a").click(false);

      $.Jcrop(img, {
          onSelect: function(c) {
              el.parent().find('[id*=x_start]').val(c.x);
              el.parent().find('[id*=y_start]').val(c.y);
              el.parent().find('[id*=x_end]').val(c.x2);
              el.parent().find('[id*=y_end]').val(c.y2);
          }
      });
    }
  }

});

});

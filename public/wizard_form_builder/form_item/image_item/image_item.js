steal('./views/show.ejs', './views/properties.ejs').then( function($) {

WizardFormBuilder.FormItem.extend('WizardFormBuilder.FormItem.ImageItem',

{
  GALLERY_RATIO: .28
},

{
  loadGalleryImage: function( src, doneCallback ) {
    var widget = this,
        w_width = this.model.attr('width'),
        w_height = this.model.attr('height'),
        w_aspect = w_width * 1.0 / w_height,

        // Create a new image so that we can track the load
        // event and make sure the image is never stretched
        img = new Image();

    $(img).bind('load', function(e) {
      var height = img.height,
          width = img.width,
          aspect = width * 1.0 / height;

      if( aspect > w_aspect ) {
        // constrained on width
        width = w_width;
        height = w_width / aspect;
      } else {
        // constrained on height
        height = w_height;
        width = w_height * aspect;
      }

      $(img).height(height * widget.Class.GALLERY_RATIO).width(width * widget.Class.GALLERY_RATIO);

      doneCallback(img);
    })
      .css('background', 'none');

    img.src = src;

    return img;
  },

  value: function( val ) {
    var widget = this;

    this.element.find('img').remove();

    if( typeof val === 'string' ) {
      // turn single image into array
      val = [val]
    }

    var loaded_images = 0;

    var $images = $(val).map(function( i, image_url ) {
      return widget.loadGalleryImage( image_url, function(image_element) {
        // thank goodness javascript is single-threaded
        loaded_images += 1;

        if( loaded_images == $images.length ) {
          $images.each( function() {
            widget.element.find('.gallery').append(this);
          });

          $images.first().click();
        }
      });
    });

    this.contentArea.append(
      $('<a/>').attr('title', 'Click to enlarge')
               .attr('target', '_blank')
               .append( $("<img/>") )
    );
  },

  redraw: function() {
    var show_tools = this.model.attr('img_tools');
    if (show_tools){
      $("<div class='img-tool'><div>").insertAfter(this.element.find('img.main'));
    }
    this.element.find('img.main').width(this.model.attr('width'))
                                 .height(this.model.attr('height'));

    this.element.find('.gallery img').width( this.model.attr('width') * this.Class.GALLERY_RATIO )
                                     .height(this.model.attr('height') * this.Class.GALLERY_RATIO );

    // Must set a height on the gallery so that a scrollbar is invoked if it gets too large
    // we don't want things overflowing their containers
    this.element.find('.gallery')
      .width(this.model.attr('width') * this.Class.GALLERY_RATIO + 10)  // padding for the scrollbar
      .height(this.model.attr('height'));
      
    if( this.model.attr('multiple') == 'true' && this.model.attr('show_thumbnail') == 'true') {
      if(this.model.attr('thumbnail_position') == 'horizontal') {
        var gallery = this.element.find('.gallery').detach().addClass("horizontal").removeAttr('style');
        if(!this.element.find(".image").find(".gallery").length) {
          this.element.find(".image").append(gallery).show();  
        }
      } else {
        this.element.find('.gallery').show().removeClass("horizontal");
      }
    } else {
      this.element.find('.gallery').hide();
    }

    // If we've set a placeholder property on this object, make it into an image
    if( typeof this.model.placeholder != 'undefined' && this.element.find('img').length == 0 ) {
      var img = $('<img/>').attr('src', this.model.placeholder);

      var item = this.model;

      img.bind('load', function(ev) {
        // don't make shit too large
        var aspectRatio = 1.0 * img.height() / img.width();

        if( img.width() > item.form.elements().width() / 2 ) {
          img.width(item.form.elements().width() / 2);
          img.height(img.width() * aspectRatio);
        }

        item.update({width: img.width(), height: img.height()});
      });

      this.element.append( img );
    }
  },

  '.gallery img click': function(el, ev) {
    el.siblings().removeClass('selected').end()
      .addClass('selected');

    this.element
      .find('a')
        .attr('href', el.attr('src'))
        .find('img')
          .attr('src', el.attr('src'))
          .width( el.width() / this.Class.GALLERY_RATIO )
          .height( el.height() / this.Class.GALLERY_RATIO );
  }
});

});

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

  // undefined is used here as the undefined global variable in ECMAScript 3 is
  // mutable (ie. it can be changed by someone else). undefined isn't really being
  // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
  // can no longer be modified.

  // window and document are passed through as local variable rather than global
  // as this (slightly) quickens the resolution process and can be more efficiently
  // minified (especially when both are regularly referenced in your plugin).

  // Create the defaults once
  var pluginName = "wizard",
  defaults = {};

  // The actual plugin constructor
  function Plugin ( element, options ) {
    this.element = $(element);
    // jQuery has an extend method which merges the contents of two or
    // more objects, storing the result in the first object. The first object
    // is generally empty as we don't want to alter the default options for
    // future instances of the plugin
    this.settings = $.extend( {}, defaults, options );
    this._defaults = defaults;
    this._name = pluginName;
    this.current_slide_index = 0;
    this.init();

  }

  Plugin.prototype = {
    init: function () {
    	this.addEvents();
      this.displaySlide(this.current_slide_index, '');      
    },

    addEvents: function(){
      var that = this;
      this.element.find(".next").click(function(e){
        that.current_slide_index += 1;
        that.displaySlide(that.current_slide_index, '.'+$(this).attr('id'));
        $('.progressmeter ul li.active').removeClass('active').addClass('complete').next().addClass('active')
        $('.progressmeter ul li.complete a').html('<img src="/assets/tick.png" width="16px"/>')
      });
      this.element.find(".prev").click(function(e){
        var parent_section = $(this).parent();
        var class_name = parent_section.parent().prev('section').find('#'+parent_section.attr('class')).closest('section').attr('class')
        that.current_slide_index -= 1;
        that.displaySlide(that.current_slide_index, '.'+class_name);
        $('.progressmeter ul li.active').removeClass('active').prev().removeClass('complete').addClass('active')
        $('.progressmeter ul li.complete a').html('<img src="/assets/tick.png" width="16px"/>')
      });
    },
    
    hideAllSlides: function(){
      this.element.find("section").hide();
    },

    displaySlide: function(idx, class_name){
      this.hideAllSlides();
      that = this;
      this.element.find(".wrap > section:eq(" + idx.toString() + ")").show().find(class_name).show();
    }
  };

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[ pluginName ] = function ( options ) {
    return this.each(function() {
      if ( !$.data( this, "plugin_" + pluginName ) ) {
        $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
      }
    });
  };

})( jQuery, window, document );

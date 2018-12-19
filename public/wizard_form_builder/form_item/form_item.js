/**
 * @class WizardFormBuilder.FormItem
 */

$.Controller('WizardFormBuilder.FormItem',
/* @Static */
{
  listensTo: ['needs_redraw']
},
/* @Prototype */
{

  init: function() {
    // Cache the model and the content area
    this.model = this.element.model();
    this.contentArea = this.element.find('div.content-area');

    // Show this element
    this.element.trigger('needs_redraw');

    /*
     * @attribute _flagState
     * In a review job, stores information about what was flagged in this component
     */
    if( this.model.reviewable ) {
      this._flagState = { status: 'unflagged' };

      if( this.model.subFlag === true ) {
        this._flagState.status = 'subflagged';
        this._flagState.flaggedIndices = [];
      }
    }
  },

  /*
   * @hide
   * Responsible for (re)drawing the element
   * DO NOT OVERRIDE THIS METHOD.
   * If you want to do extra drawing in code, provide a redraw() method in your class
   */
  _show: function() {
    if (Array.prototype.indexOf.call(this.element.context.classList, 'static_text_item') >= 0) {
      var view = this.view('show');
      var converter = new Markdown.Converter();
      var $view = $(view);
      var redefined_html = converter.makeHtml(this.model.text);
      var content_html = $view.html("").html(redefined_html)[0]
      this.contentArea.html(content_html);
    } else {
      this.contentArea.html( this.view('show') );
    }


    // If the controller wants to do any drawing in code, it has to do it after
    // we switch up the HTML content, but before we adjust the size of the hider
    if( typeof this['redraw'] !== 'undefined' )
      this.redraw();

    this.element.css('top', this.model.attr('y'))
                .css('left', this.model.attr('x'))
          .find('.hider').height( this.element.outerHeight() )
                         .width( this.element.outerWidth() ).end()

          .find('.resize.e, .resize.w').css('top', this.element.outerHeight() / 2.0);
  },

  add_tooltip: function(){
    var required = this.model.attr('required');
    if (required){
      var required_span = '<span class="required">*</span>';
      this.element.find('label').first().append(required_span);
    }
    var tooltip = this.model.attr('tooltip');
    if ((tooltip != undefined) && (tooltip != '')){
      var tooltip_span = '<span class="help_icon" float="left"></span>';
      this.element.find('label').first().append(tooltip_span);
    }
  },

  /*
   * The preferred way to trigger a redraw on this element.
   * Can be called with $(element).trigger('needs_redraw')
   */
  needs_redraw: function() {
    this._show();
  },

  /*
   * Get the final flagged state before submit
   */
  flagState: function() {
    return this._flagState;
  },

  /*
   * Toggle the flagged state of this element in a review job.
   * May be overriden by child classes.
   * @param {el} The element that was clicked on.
   * @param {ev} The jQuery click event object.
   */
  toggleFlag: function(el, ev) {
    var flagStatus = this._flagState.status;

    if( flagStatus == 'flagged' ) {
      this.element.removeClass('flagged');
      this._flagState.status = 'unflagged';
    } else if( flagStatus == 'unflagged' ) {
      this.element.addClass('flagged');
      this._flagState.status = 'flagged';
    }
  },

  /*
   * Click handler. If this is a review job and this element is reviewable and not frozen, toggle the flagged state.
   */
  click: function(el, ev) {
    if( this.options.jobtype == 'review' && this.model.reviewable && this._flagState.status != 'frozen' ) {
      this.toggleFlag(el, ev);
    }
  },

  /*
   * Resizing this element using the drag handles
   */
  '.resize mousedown': function( el, ev ) {
    ev.preventDefault();
    // Don't allow dragging of this element
    ev.stopImmediatePropagation();

    var originalWidth = this.model.attr('width'),
        originalHeight = this.model.attr('height'),
        originalX = this.model.attr('x'),
        originalY = this.model.attr('y'),

        form_constraints = this.model.form.inner_constraints(),
        item_constraints = this.model.constraints(),

        // Don't resize outside the bounds of the form
        minDiffX = form_constraints.lowX - item_constraints.lowX,
        minDiffY = form_constraints.lowY - item_constraints.lowY,
        maxDiffX = form_constraints.highX - item_constraints.highX,
        maxDiffY = form_constraints.highY - item_constraints.highY,

        model = this.model,
        controller = this,
        resizeType = el.attr('class').replace(/\s*resize\s*/, '');

    // Make sure, even if the mouse ends up outside this element, the cursor doesn't change
    $('body').add(this.element.find('.hider')).css('cursor', el.css('cursor'));

    var mmt = new MouseMoveTracker(ev);
    mmt.mousemove = function(diffX, diffY) {
      var minDim = 30,

          newX = originalX,
          newY = originalY,
          newWidth = originalWidth,
          newHeight = originalHeight;

      // This enables us to take care of all the directions without special-casing each one
      if( resizeType.indexOf('e') !== -1 ) {
        newWidth = Math.max(originalWidth + Math.min(diffX, maxDiffX),  minDim);
      }

      if( resizeType.indexOf('w') !== -1 ) {
        newWidth = Math.max(originalWidth - Math.max(diffX, minDiffX), minDim);

        // Only calculate the new X value after we adjust width for the bounds
        newX = originalX - (newWidth - originalWidth);
      }

      if( resizeType.indexOf('s') !== -1 ) {
        newHeight = Math.max( originalHeight + Math.min(diffY, maxDiffY), minDim);
      }

      if( resizeType.indexOf('n') !== -1 ) {
        newHeight = Math.max(originalHeight - Math.max(diffY, minDiffY), minDim);

        // Only calculate the new Y value after we adjust height for the bounds
        newY = originalY - (newHeight - originalHeight);
      }

      model.attrs({x: newX, y: newY, width: newWidth, height: newHeight});
    }
    mmt.mouseup = function(diffX, diffY) {
      if (model.type == 'PdfItem') {
      	$(".pdf_width").trigger('focusout');
      }
      // may be used for feature if we want to implement vertical image gallery
      // if (model.type == 'ImageItem' && model.multiple == 'true' && model.show_thumbnail == 'true' && model.thumbnail_position == 'vertical') {
      //   $("#width").trigger("focusout");
      // }
      model.save();

      // Undo our cursor setting hack from above
      $('body').add(controller.element.find('.hider')).css('cursor', '');
    }

  },

  /*
   * Enable in-place editing on fields that support it.
   * Right now, this allows editing the text in static title and description
   * fields without using the inspector panel.
   */
  enableInPlaceEdits: function(el, ev) {
    if( this.element.hasClass('active') && this.element.find('.text-editable').length > 0 ) {
      // Don't let this trigger the mousedown event in form_controller
      ev.stopPropagation();

      if( ! this.element.hasClass('editing') ) {
        this.element.addClass('editing');

        // Get rid of hider so that it doesn't grab click events
        this.element.find('.hider').css('z-index', '-10');

        var editableText = this.element.find('.text-editable');
        var editElement = editableText.hasClass('text-area') ? 'textarea' : 'input';
        editableText.remove();

        // Add an input element with value = the text
        var inputElement = $('<' + editElement + '/>').val( this.model.attr(this.model.Class.textEditable) )
        this.contentArea.append( inputElement );

        if( editElement == 'textarea' ) {
          inputElement.height(this.model.attr('height') - 20);
        }

        // Place cursor in this field
        inputElement.focus();

        // If it hasn't been edited yet, select the entire text
        if( inputElement.val() == this.model.Class.defaults[this.model.Class.textEditable] ) {
          inputElement.select();
        }

        // Don't trigger a click event which will blur the new input field
        ev.preventDefault();
      }
    }
  },

  /*
   * Enable in place editing by clicking on the pencil icon
   */
  '.edit-text click': function(el, ev) {
    if( this.element.hasClass('disabled') ) return;

    this.enableInPlaceEdits(el, ev);
  },

  /*
   * Enable in-place editing by double-clicking on this element
   */
  dblclick: function(el, ev) {
    if( this.element.hasClass('disabled') ) return;

    this.enableInPlaceEdits(el, ev);
  },

  /*
   * Mousedown in a text area will trigger a blur event, which is our cue to
   * save the in-place edits. Therefore, we prevent this event from happening.
   */
  'input,textarea mousedown': function(el, ev) {
    ev.stopPropagation();
  },

  /*
   * Pressing enter in a text input field will trigger blur and save, for
   * in-place edits in form_builder. For obvious reasons, we don't do this in textarea.
   */
  'input keypress': function(el, ev) {
    if( this.element.hasClass('editing') && ev.keyCode == 13 ) {
      el.blur();
    }
  },

  /*
   * Save in-place edits when the textarea or input field loses focus
   */
  'input,textarea blur': function(el, ev) {
    if( this.element.hasClass('editing') ) {
      this.element.removeClass('editing');

      this.model.attr(this.model.Class.textEditable, el.val());
      this.model.save();

      // Put the hider back
      this.element.find('.hider').css('z-index', '');

      this.element.trigger('needs_redraw');
    }
  }
}
);

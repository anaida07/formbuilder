/**
 * @class WizardFormBuilder.Form
 * @parent index
 * @inherits jQuery.Controller
 * Display and edit forms.
 */
$.Controller('WizardFormBuilder.Form',
/* @Static */
{
  // These are not 'normal DOM events' apparently
  listensTo: ['dragover', 'dragenter', 'drop', 'submit'],

  defaults: {
    jobtype: 'content',  // 'content' or 'review'
    mode: 'editable',     // 'editable', 'preview', 'performable'
    input_klasses: [
               "WizardFormBuilder.Models.ImageItem",
               "WizardFormBuilder.Models.PdfItem",
               "WizardFormBuilder.Models.DynamicTextItem",
               "WizardFormBuilder.Models.DynamicLinkItem",
               "WizardFormBuilder.Models.HtmlField",
               "WizardFormBuilder.Models.AudioItem"]
  },

  REVIEW_INSTRUCTIONS:
   "<div class='review-instructions'>" +
    "<h2>Extra Instructions (read carefully!):</h2>" +
    "<p>Another worker has completed this task. Please review their work and <strong style='color: red'>click on any answer that you judge to be wrong</strong>, based on your best interpretation of the instructions. For multiple choice and checkboxes, count both wrongly selected and missed answers as wrong.<p>" +
    "<ul>" +
      "<li><strong>Read</strong> the instructions given to the original worker</li>" +
      "<li>Answers that are clickable will appear raised.</li>" +
      "<li>If an item is highlighted orange, extra instructions apply. Click on each part that is answered wrong.</li>" +
    "</ul>" +
   "</div>",

  CONTENT_INSTRUCTIONS:
   "<div class='review-instructions'>" +
    "<h2>Extra Instructions (read carefully!):</h2>" +
    "<p>Complete this task according to the instructions given.</p>" +
    "<ul>" +
      "<li>If a field is grayed-out or disabled, other workers have determined the answer already. You do not need to edit it.</li>" +
      "<li>If a field has highlighted items, other workers have marked them incorrect. Please correct them.</li>" +
    "</ul>" +
   "</div>"
},
/* @Prototype */
{
  form: null,
  activeItems: [],
  shiftActive: false,

  init: function() {
    // Save the original contents of the form, minus any script tags
    this.originalContents = this.element.contents(':not(script)');

    // Load the form, and when the ajax is done, show the form!
    this.loadForm( this.options.form_id )
        .done( this.proxy('show') );
  },

  update: function( options ) {
    this._super(options);
    this.show();
  },

  /*
   * Render (or re-render) this form.
   * Right now we assume that the form we are rendering can't change between page loads.
   * If this is ever different, we need to rethink this method a tiny bit (mostly in setting
   * the model and identity class)
   */
  show: function() {
    var controller = this;

    /* Make sure all of the old stuff is cleared out, but keep anything
     * that was in the HTML originally (such as CSRF token, UTF-8 token)
     */
    this.element.empty()
                .append(this.originalContents)
                .removeClass('empty editable preview');

    $('.review-instructions').remove();

    // Allow the form to know what element it's attached to
    this.element.model(this.form)
                .addClass(this.form.identity());

    if( this.options.jobtype == 'review' ) {

      this.element.before(this.Class.REVIEW_INSTRUCTIONS)
                  // Send back the flagged items
                  .append( $('<input/>').attr('type', 'hidden').attr('name', 'flagged_items') );
    } else if( this.options.jobtype == 'content' && this.options.field_states ) {
      this.element.before(this.Class.CONTENT_INSTRUCTIONS);
    }

    if ( this.options.mode == 'editable' ) {
      this.element.addClass( 'editable' );
    } else if( this.options.mode == 'preview' ) {
      this.element.addClass( 'preview' );
    }

    // Render the items on the form
    if( this.form.items.length == 0 ) {
      this.element.addClass('empty');
    } else {
      this.element.removeClass('empty');

      // Draw each item on the form
      this.form.items.each( function() { controller.renderItem(this) } );
    }

    // Add a submit button to the form
    if(( this.options.mode == 'performable' ) || ( this.options.mode == 'preview' ) ){
      this.element.append(
        $('<input/>').attr('type', 'submit')
                     .attr('name', 'submit')
                     .val('Submit')
                     .addClass('action-button large btn btn-primary')
                     .css('position', 'absolute')
                     .css('right', '20px')
                     .css('bottom', '20px')
      );
    }

    /* Show a screen explaining the form editor */
    // if( typeof show_explainer != 'undefined' && show_explainer ) {
    //   this.element.find('.explainer').show().height(this.element.height() - parseInt(this.element.find('.explainer').css('padding-top').match(/\d+/)[0]));
    //   show_explainer = false;
    // }

    // Catch keyboard events from the beginning
    // FIXME
    //el.focus();
  },

  /*
   * Loads a Form from the server and renders it
   * @param {Number} id Form id on server.
   * @return {$.Deferred} a jQuery Deferred object representing the Ajax call
   */
  loadForm: function(id) {
    var controller = this,
        deferred = WizardFormBuilder.Models.Form.findOne({id: id});

    deferred.done( function(f) { controller.form = f; } );

    return deferred;
  },

  /*
   * Draw an item model on the form
   * @param {WizardFormBuilder.Models.FormItem} item The item model to render
   */
  renderItem: function(item) {
    // Create a DOM element for this widget, and add it
    var form_item_element = this.createBaseElement(item);

    this.element.append( form_item_element );

    // Attach the appropriate controller to this element
    var item_controller = new WizardFormBuilder.FormItem[item.type]( form_item_element, {jobtype: this.options.jobtype} );

    // Set the value of this widget, if we've been provided data
    if( this.options.mode != 'editable' && this.options.data ) {
      if( item.attr('name') in this.options.data && this.options.data[ item.attr('name') ] !== null ) {
        item_controller.value( this.options.data[item.attr('name')] );
      } else if( typeof item_controller['value'] == 'function' ) {
        // Set a blank value if this item isn't present
        item_controller.value('');
      }
    }

    // Freeze or highlight this widget, if need be
    if( this.options.mode != 'editable' && this.options.field_states ) {
      var field_states = this.options.field_states,
          frozen_fields = field_states.frozen,
          highlighted_fields = field_states.highlighted;

      if( typeof frozen_fields == 'object' && frozen_fields.indexOf(item.attr('name')) !== -1 ) {
        item_controller.freeze();
      }

      if( typeof highlighted_fields == 'object' && highlighted_fields[ item.attr('name') ] ) {
        item_controller.highlight( highlighted_fields[ item.attr('name') ] );
      }
    }

    // Set the initial flagged state (used to view results of review assignments in admin panel)
    if( this.options.mode != 'editable' && this.options.jobtype == 'review' &&
        this.options.data.flagged_items && this.options.data.flagged_items[item.attr('name')]) {

      var flag_state = this.options.data.flagged_items[item.attr('name')];

      if( ! item.subFlag ) {
        // This is not a subflagged widget. We'll just toggle the flag if it's on.
        if( flag_state.status == 'flagged' ) {
          item_controller.toggleFlag();
        }
      } else {
        // This is a subflagged widget. We'll let it deal with setting its flagged state.
        if( typeof item_controller.setFlags == 'function' ) {
          item_controller.setFlags(flag_state);
        }
      }
    }

    // Determine whether the form needs to increase in height to accomodate this element
    // Always leave 70 px to accommodate the submit button.
    if( item.constraints().highY + 70 >= this.form.inner_constraints().highY ) {
      this.element.height(item.constraints().highY + 70);
    }

    return form_item_element;
  },

  /*
   * Create the default container that any form item will live inside of.
   * @param {WizardFormBuilder.Models.FormItem} item The item model to generate the element for
   */

  createBaseElement: function(item) {
    var el = $('<div/>')
      .addClass('form-item')        // generic class for all form items
      .model(item)                  // allow this element to know which model its attached to and vice-versa
      .attr('tabindex', '-1')

      .append( $('<div/>').addClass('content-area') ) // where all the actual element display goes
      .append( $('<div/>').addClass('hider') );       // steals click events to enable drag and drop of input elements when the form is editable

    // Add resize handles
    $(item.Class.resizable).each( function(i, dir) {
      el.append( $('<div/>').addClass('resize').addClass(dir) );
    });

    // Add editable text link
    if( item.Class.textEditable ) {
      el.append( $('<div/>').addClass('edit-text') );
    }

    if( this.options.jobtype == 'review' && item.reviewable ) {
      el.addClass('review');

      if( item.subFlag )
        el.addClass('subFlag');
    }

    return el;
  },

  /*
   * Save every item model in the form to the server
   */
  saveForm: function() {
    this.form.items.each( function() { this.save(); });
  },

  /*
   * Keydown event handler
   *
   * In editable mode
   *
   *   - tracks when shift has been pressed (to select multiple items).
   *   - tracks if backspace/delete is pressed, to remove items
   */
  keydown: function(el, ev) {
    // Only respond to this event if we are building the form
    if( this.options.mode != 'editable' ) return;

    // Don't respond if we're in an input field
    if( $(ev.target).is('input') || $(ev.target).is('textarea') || $(ev.target).prop('contentEditable') == 'true' ) return;

    if( ev.keyCode == 16 ) {
      this.shiftActive = true;
    } else if( ev.keyCode == 8 || ev.keyCode == 46 ) {
      // backspace or delete
      ev.preventDefault();

      // make a copy so that destroying objects won't affect our iteration
      var items = this.activeItems.slice(0);

      // Do this now, so that the inspector doesn't glitch open when we reach 1 to go
      this.setActiveItem(null);

      $.each( items, function(idx, item) {
        item.destroy();
      });
    }
  },

  /*
   * In performable mode, submit hit when ctrl = is pressed
   * In editable mode, detect release of shift key.
   */
  keyup: function(el, ev) {
    if( this.options.mode == 'editable' && ev.keyCode == 16 ) {
      this.shiftActive = false;
    }
  },

  /**
    * Detect ctrl = to submit the form
    */
  keypress: function(el, ev) {
    if( this.options.mode == 'performable' && ev.ctrlKey && ev.which == 61 ) {
      this.element.find('input[type=submit]').click();
    }
  },

  /*
   * Drag to select multiple elements
   */
  mousedown: function(el, ev) {
    // Only respond to this event if we are building the form
    if( this.options.mode != 'editable' ) return;

    // Catch keyboard events
    this.element.focus();

    if( ev.target !== this.element.get(0) ) {
      // Only allow dragging on blank form space, not form fields
      return;
    }

    // prevent highlighting
    ev.preventDefault();

    var padding = (this.element.outerWidth() - this.element.width()) / 2,
        x = ev.layerX - padding,
        y = ev.layerY - padding,
        width = 0,
        height = 0,
        form = this.form,
        controller = this,
        selectorDiv = $('<div/>').attr('id', 'drag-selection')
                                 .css('top', y)
                                 .css('left', x)
                                 .width(width)
                                 .height(height);

    this.element.append(selectorDiv);

    var mmt = new MouseMoveTracker(ev);
    mmt.mousemove = function(diffX, diffY) {
      var mouseX = Math.min( Math.max(0, x + diffX), el.width() ),
          mouseY = Math.min( Math.max(0, y + diffY), el.height() );

      width = mouseX - x;
      height = mouseY - y;

      var newX = x,
          newY = y,
          newWidth = width,
          newHeight = height;

      // Redraw the box
      if( width < 0 ) {
        newX = x + width;
        newWidth = -width;
      }
      if( height < 0 ) {
        newY = y + height;
        newHeight = -height;
      }

      selectorDiv.width(newWidth).css('left', newX)
                 .height(newHeight).css('top', newY);
    }

    mmt.mouseup = function(diffX, diffY) {
      controller.setActiveItem(null);

      if( width < 0 ) {
        width = -width;
        x = x - width;
      }
      if( height < 0 ) {
        height = -height;
        y = y - height;
      }

      var items = []

      // Find all fields enclosed by this selection and make them active
      $.each( form.items, function(idx, item) {
        var c = item.constraints();
        if( c.lowX >= x && c.lowY >= y && c.highX <= x + width && c.highY <= y + height ) {
          items.push(item);
        }
      });

      controller.setActiveItems(items);

      selectorDiv.remove();
    }
  },

  /*
   * Move individual form items around
   */
  '.form-item mousedown': function(el, ev) {
    // Only respond to this event if we are building the form
    if( this.options.mode != 'editable' ) return;

    // prevent text highlighting
    ev.preventDefault();

    // Don't allow selection or moving of unsaved items
    if( el.hasClass('disabled') ) return;

    // Catch keyboard events
    // FIXME
    //this.element.focus();

    if( this.shiftActive ) {
      // They are selecting/deselecting another field using shift key
      // Activate/deactivate it
      this.addOrRemoveActiveItem(el.model());
    } else if( !el.hasClass('active') ) {
      // They have moused-down on an inactive field
      // Make it the only active field
      this.setActiveItem(el.model());
    }

    // If this element was deselected (with shift), don't allow them to drag
    if( !el.hasClass('active') ) {
      return;
    }

    var formEl = this.element,
        lowestX = -100000, lowestY = -100000, highestX = 100000, highestY = 100000,
        form = this.form,
        form_constraints = this.form.inner_constraints(),
        activeItems = this.activeItems;

    $(activeItems).each( function() {
      var item_constraints = this.constraints();

      this.beforeDragX = this.attr('x');
      this.beforeDragY = this.attr('y');

      // Calculate the range of differences in x and y we can go with the mouse relative to our
      // starting coordinate before elements will start to leave the window
      var thisLowestX = -item_constraints.lowX;
      var thisLowestY = -item_constraints.lowY;
      var thisHighestX = form_constraints.highX - item_constraints.highX;
      var thisHighestY = form_constraints.highY - item_constraints.highY;

      if( thisLowestX > lowestX ) lowestX = thisLowestX;
      if( thisLowestY > lowestY ) lowestY = thisLowestY;
      if( thisHighestX < highestX ) highestX = thisHighestX;
      if( thisHighestY < highestY ) highestY = thisHighestY;
    });

    var mmt = new MouseMoveTracker(ev);
    mmt.mousemove = function(diffX, diffY) {
      // stay within our bounds
      if( diffX < lowestX ) diffX = lowestX;
      if( diffY < lowestY ) diffY = lowestY;
      if( diffX > highestX ) diffX = highestX;
      if( diffY > highestY ) diffY = highestY;

      $(activeItems).each( function() {
        this.attrs({x: this.beforeDragX + diffX, y: this.beforeDragY + diffY});
      });
    };

    mmt.mouseup = function(diffX, diffY) {
      // Find lowest x and y coord of dragged fields
      var lowX = Math.min.apply( null, $(activeItems).map( function(i, item) { return item.constraints().lowX; }).toArray() ),
          lowY = Math.min.apply( null, $(activeItems).map( function(i, item) { return item.constraints().lowY; }).toArray() ),
          highX = Math.max.apply( null, $(activeItems).map( function(i, item) { return item.constraints().highX; }).toArray() ),
          highY = Math.max.apply( null, $(activeItems).map( function(i, item) { return item.constraints().highY; }).toArray() ),

          // Snap those coords to a grid
          // Snap these coordinates to a 5px grid
          itemDiffX = WizardFormBuilder.Util.newCoordSnapped(lowX, 20) - lowX,
          itemDiffY = WizardFormBuilder.Util.newCoordSnapped(lowY, 20) - lowY;

      // Make sure we don't overflow the right side bounds
      if( itemDiffX + highX > form.inner_constraints().highX ) {
        itemDiffX = form.inner_constraints().highX - highX;
      }

      // or the bottom bounds
      if( itemDiffY + highY > form.inner_constraints().highY ) {
        itemDiffY = form.inner_constraints().highY - highY;
      }

      $(activeItems).each( function() {
        this.attrs({x: this.attr('x') + itemDiffX, y: this.attr('y') + itemDiffY});

        // Only save if this item was actually moved. This event will still be triggered even if they just
        // click on the item and don't actually move it.
        if( this.attr('x') !== this.beforeDragX || this.attr('y') !== this.beforeDragY ) {
          this.save();
        }
      });

    };
  },

  /*
   * Add or remove a field from the collection of active items
   * @param {WizardFormBuilder.Models.FormItem} item The item model to add or remove
   */
  addOrRemoveActiveItem: function(item) {
    var index = this.activeItems.indexOf(item);
    if( index == -1 ) {
      item.activate();
      this.activeItems.push(item);
    } else {
      item.deactivate();
      this.activeItems.splice(index, 1);
    }

    // Tell everything else in the app that the active fields have changed
    OpenAjax.hub.publish('fields.active', this.activeItems);
  },

  /*
   * Set the collection of active items.
   * @param {Array} items Array of model items to be active
   */
  setActiveItems: function(items) {
    $.each(this.activeItems, function() { this.deactivate() });
    this.activeItems = items;
    $.each(items, function() { this.activate() } );

    // Tell everything else in the app that the active fields have changed
    OpenAjax.hub.publish('fields.active', this.activeItems);
  },

  /*
   * Set the active item on the form
   * @param {WizardFormBuilder.Models.FormItem} item The item to become active. Can be null, in which case all items are deactivated.
   */
  setActiveItem: function(item) {
    this.setActiveItems( item == null ? [] : [item] );
  },

  'fields.deactivate_all subscribe': function() {
    this.setActiveItems([]);
  },

  calculateDropCoordinates: function(element, ev) {
    // Calculate the new position of the element = the event position
    var newX = ev.layerX || ev.originalEvent.layerX;
    var newY = ev.layerY || ev.originalEvent.layerY;

    // However, if this event was not triggered on the top-level element, we must add
    // the offset of the child element inside of the parent element
    if( element.get(0) != ev.target) {
      if( $(ev.target).parents('#prodder').length == 0 ) {
        //not over something that is itself relatively positioned
        newX += $(ev.target).offset().left - element.offset().left;
        newY += $(ev.target).offset().top - element.offset().top;
      }
    }

    // Make sure we're not overlapping our box on the top / left
    if( newY < 0 ) newY = 0;
    if( newX < 0 ) newX = 0;

    // Snap these coordinates to a 20px grid
    newX = WizardFormBuilder.Util.newCoordSnapped(newX, 20);
    newY = WizardFormBuilder.Util.newCoordSnapped(newY, 20);

    return {x: newX, y: newY};
  },

  dragover: function(el, ev) {
    // Only respond to this event if we are building the form
    if( this.options.mode != 'editable' ) return;

    // Must cancel this event for dragging to work
    ev.preventDefault();
    return false;
  },

  dragenter: function(el, ev) {
    // Only respond to this event if we are building the form
    if( this.options.mode != 'editable' ) return;

    // Must cancel this event for dragging to work
    ev.preventDefault();
    return false;
  },

  createItem: function(klass, coordinates) {
    // Do not allow to add any input elements
    if (this.form.limit_edit && this.options.input_klasses.indexOf(klass) >= 0 ) return;

    // Sequentially numbered form fields are harder to do than it would seem at first blush
    var klassObj = $.String.getObject(klass);
    var prefix = klassObj.displayName.replace(/ /g, '');

    // Grab all the numbers off fields of this type
    var nameMatches = this.form.items.grep( function(field, i) { return field.Class.fullName == klass } )
      .map( function(field, i) {
        if( typeof field.name == 'undefined' )
          return 0;

        var m = field.name.match( new RegExp('^' + prefix + '(\\d+)$') );

        if( m )
          return parseInt(m[1]);
        else
          return 0;
        });

    // Sort by numericality
    nameMatches = nameMatches.sort(function(a, b) {if (a < b) return -1; else if( a == b ) return 0; else return 1; });

    // Get the last one unless the list is empty
    var lastId = 0;
    if( nameMatches.length > 0 )
      lastId = nameMatches[nameMatches.length - 1];

    var newItem = new (klassObj)({
      x: coordinates.x,
      y: coordinates.y,
      form_id: this.form.id,
      name: prefix + (lastId + 1)
    });

    this.form.addItem(newItem);
    var el = this.renderItem(newItem);

    // Determine whether this element's x coordinate is too high, if so adjust it.
    // This must be done after it is rendered, obviously.
    if( newItem.constraints().highX > this.form.inner_constraints().highX ) {
      newItem.attr('x', newItem.attr('x') - (newItem.constraints().highX - this.form.inner_constraints().highX) );
    }

    // We don't want to allow editing of this item until it has saved
    el.addClass('disabled')
      .append( $('<div/>').addClass('spinner').width( el.width() ).height( el.height() ) );

    newItem.save( function() {
      // On successful save, we'll hook up the real ID from the server.
      // Also, we'll clean up the fake identity from when the ID was undefined
      el.addClass( this.identity() )
        .removeClass('disabled')
        .removeClass( this.identity().replace( this.attr('id'), 'undefined' ) )
    });

    // focus this form so that we can catch keyboard events like SHIFT
    this.element.focus()
                .removeClass('empty');
  },

  'form_item.do_add subscribe': function(message, klass) {
    // create item below all other items
    var y = 0;
    this.form.items.each( function(i, item) {
      if( item.constraints().highY > y )
        y = item.constraints().highY
    });

    this.createItem( klass, {x: 0, y: y + 20} );
  },

  /**
   * Respond to the drop event (most likely from a new widget being dragged into the form)
   */
  drop: function(el, ev) {
    // Only respond to this event if we are building the form
    if( this.options.mode != 'editable' ) return;

    // This event will be fired when anything is dropped in this controller's element
    ev.preventDefault();

    var dt = ev.originalEvent.dataTransfer;
    dt.effectAllowed = 'copy';

    if( dt.files.length > 0 ) {
      // var file = dt.files[0];
      //
      // if( file.type.match(/image.*/) ) {
      //   var dropCoordinates = this.calculateDropCoordinates(this.element, ev),
      //       form = this.form,
      //       reader = new FileReader();
      //
      //   reader.onload = function(e) {
      //     var img = new WizardFormBuilder.Models.ImageItem({x: dropCoordinates.x, y: dropCoordinates.y, form_id: form.id});
      //     img.placeholder = e.target.result;
      //     img.save();
      //   }
      //   reader.readAsDataURL(file);
      // }

    } else {
      // Drag and drop from this or another browser window
      var dropCoordinates = this.calculateDropCoordinates(this.element, ev);

      // Get the dragged element. Remove any unsightly meta tags
      var elem = dt.getData('text/html').replace(/<meta.*?>/g, '');
      var className = $(elem).data('class');

      if( typeof className !== 'undefined' ) {
        // This is one of our 'widgets'
        this.createItem(className, dropCoordinates);
      } else {
        // this came from somewhere else (other browser window, text editor, etc.)
      }
    }
  },

  'form_item.destroyed subscribe': function(message, form_item) {
    // Do not allow to add any input elements
    if (form_item.readonly) return;

    this.form.removeItem(form_item);
    form_item.elements().remove();

    // If the field which was destroyed is still active, remove it from the active list
    var index = this.activeItems.indexOf(form_item);
    if( index !== -1 ) {
      this.activeItems.splice(index, 1);

      // Tell everything else in the app that the active fields have changed
      OpenAjax.hub.publish('fields.active', this.activeItems);
    }

    if( this.form.items.length == 0 ) {
      this.element.addClass('empty');
    }
  },

  // Using the handle on the bottom of the form, resize the height
  '.s-resize mousedown': function(el, ev) {
    ev.preventDefault();

    var origHeight = this.element.height(),
        el = this.element,
        minHeight = Math.max.apply(null, this.form.items.map( function(item) { return item.constraints().highY} ) );

    // Don't go below the lowest
    var mmt = new MouseMoveTracker(ev);
    mmt.mousemove = function(diffX, diffY) { el.height( Math.max(minHeight, origHeight + diffY) ); };
  },

  /*
   * Before this form is submitted, do some pre-processing on it.
   */
  submit: function(el, ev) {
    // Call a before submit function on each controller, in case it wants
    // to modify what it will send at all.
    this.form.items.each( function() {
      var controller = this.elements().first().controller();
      if( controller['beforeSubmit'] ) {
        controller.beforeSubmit();
      }
    });

    // Serialize the flagged items if this is a review job
    if( this.options.jobtype == 'review' ) {
      var flaggedItems = {};

      // Only look at reviewable items (tasks)
      this.form.items.match('reviewable', true).each( function() {
        var controller = this.elements().first().controller();
        flaggedItems[this.attr('name')] = controller.flagState();
      });

      this.element.find('input[name=flagged_items]').val( $.toJSON(flaggedItems) );
    }
  }
}
);

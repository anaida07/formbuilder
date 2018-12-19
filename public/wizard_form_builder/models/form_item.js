$.Model('WizardFormBuilder.Models.FormItem', {

/* @static */
  TYPE: 'item',

  /* Any illegal API Name can go in this array */
  ILLEGAL_NAMES: ['', 'id', 'task_id', 'identifier', 'created_at', 'updated_at', 'data', 'type', 'num_errors', 'flagged_items', 'flagged_items_without_ie'],

  associations: {
    belongsTo: 'WizardFormBuilder.Models.Form'
  },

  asDraggable: function() {
    return $('<div/>')
      .addClass('form-draggable tooltip')
      .attr('data-class', this.fullName)
      .attr('draggable', true)
      .attr('title', this.tooltip || "Tooltip")
      .append( $('<span/>').append(this.displayName || this.shortName));
  },

  /**
   * Creates a form.
   * @param {Object} attrs A form's attributes.
   * @param {Function} success a callback function that indicates a successful create.  The data that comes back must have an ID property.
   * @param {Function} error a callback that should be called with an object of errors.
   */
  create: function( attrs, success, error ){
    OpenAjax.hub.publish('form_item.saving');
    $.ajax({
      url: '/admin/form_items/',
      type: 'post',
      dataType: 'json',
      beforeSend : function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      success: this.callback(['saved', success]),
      error: this.callback(['createFailed', error]),
      data: {data: $.toJSON(attrs)},          // JSON-encode this so ints stay ints
      fixture: '-restCreate'                  // only in test mode
    });
  },

  update: function( id, attrs, success, error ) {
    OpenAjax.hub.publish('form_item.saving');
    $.ajax({
      url: '/admin/form_items/'+ id,
      type: 'put',
      dataType: 'json',
      beforeSend : function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      success: this.callback(['saved', success]),
      error: this.callback(['saveFailed', error]),
      data: {data: $.toJSON(attrs)},
      fixture: '-restUpdate'                  // only in test mode
    })
  },

  destroy: function( id, success, error ) {
    OpenAjax.hub.publish('form_item.saving');
    $.ajax({
      url: '/admin/form_items/' + id,
      type: 'delete',
      dataType: 'json',
      beforeSend : function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      success: this.callback(['saved', success]),
      error: this.callback(['destroyFailed', error]),
      fixture: '-restDestroy'                  // only in test mode
    })
  },

  saved: function(attrs) {
    OpenAjax.hub.publish('form_item.saved');

    // Must return these so that they pass through to other callbacks
    return attrs;
  },

  createFailed: function() {
    OpenAjax.hub.publish('form_item.createFailed');
  },

  saveFailed: function() {
    OpenAjax.hub.publish('form_item.saveFailed');
  },

  destroyFailed: function() {
    OpenAjax.hub.publish('form_item.destroyFailed');
  }
},

/* @prototype */
{
  /*
   * @attribute subFlag
   * Does this field have subscore flagging?
   */
  subFlag: false,

  init: function() {
    // Set 'type' attribute
    if( !this.attr('type') ) {
      this.attr('type', this.Class.shortName);
    }

    /* Updated, created, destroyed, will be published with the child class name */
    /* We will publish a generic event which is more useful */

    this.bind('updated.attr', function(ev, name, val) {
      this.redraw();
      OpenAjax.hub.publish('form_item.updated', {field: this, name: name, val: val})
    });

  },

  destroy: function() {
    if (this.readonly) return;
    // Take care of the interface first
    OpenAjax.hub.publish('form_item.destroyed', this);

    // Now destroy on the server
    this._super.call( this, arguments );
  },

  redraw: function() {
    // Trigger an event to let any controllers on this element know that they should redraw themselves
    this.elements().trigger('needs_redraw');
  },

  activate:   function() { this.elements().addClass('active'); },
  deactivate: function() { this.elements().removeClass('active'); },

  /* Return the lowest and highest x and y coordinates of this element */
  constraints: function() {
    return {
      lowX: this.attr('x'),
      lowY: this.attr('y'),
      highX: this.attr('x') + this.elements().outerWidth(),
      highY: this.attr('y') + this.elements().outerHeight()
    };
  },

  setName: function(name) {
    // no spaces or | (used in reputation) in field name
    var newname = name.replace(/[^a-zA-Z 0-9_]+/g, '').replace(/\./g, '').split(' ').join('')

    if( this.Class.ILLEGAL_NAMES.indexOf(newname) !== -1 )
      return this.name;
    else
      return newname;
  },

  // Make sure attr('x|y|width|height') always return ints
  getX: function() { return parseInt(this.x); },
  getY: function() { return parseInt(this.y); },
  getWidth: function() { return parseInt(this.width); },
  getHeight: function() { return parseInt(this.height); }

});

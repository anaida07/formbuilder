steal('./views/show.ejs', './views/properties.ejs').then( function($) {

WizardFormBuilder.FormItem.extend('WizardFormBuilder.FormItem.TextArea',
/* STATIC */
{
},
/* PROTOTYPE */
{
  __value: null,
  __valueAsWordsAndSpaces: null,

  redraw: function() {
    this.add_tooltip();
    this.element.find('.value')
      .width(this.model.attr('width'))
      .height(this.model.attr('height'));

    this.element.find('label').width(this.model.attr('width'));
  },

  /*************************************************************
   * HOVER EVENT HANDLERS
   * Expand the text area on hover, in case the content is
   * larger than the template designer alloted for
   *************************************************************/

  hoverinit: function(el, ev, hover) {
    hover.delay(0);
  },

  hoverenter: function() {
    // Allow this element to expand on hover. We don't know how large the content
    // is until we nullify the set height, but we want to make sure that it doesn't
    // actually shrink the element. If that happens, we put it back
    this.element.find('pre.value').height('');

    if( this.element.find('pre.value').height() < this.model.attr('height') ) {
      this.element.find('pre.value').height( this.model.attr('height') );
    }
  },

  hoverleave: function() {
    this.element.find('pre.value').height(this.model.attr('height'));
  },

  /****************************************************************
   * Public Methods
   ****************************************************************/

  /**
   * Set the value of this component for the content or review job
   */
  value: function(val) {
    // Cache the value that we've been given for later usage.
    this.__value = val;

    if( this.options.jobtype == 'review' ) {

      if( this.model.subFlag ) {
        this._initializeSubFlaggedState();

        // Tag each word so it can be flagged individually
        val = this._valueAsTaggedWords();
      }

      // This element is a pre, so newlines will be reflected appropriately
      this.find('.value').html(val);

    } else {
      // It's a content job, meaning we have a textarea, use the val method
      this.find('.value').val(val);
    }
  },

  /**
   * If the initial flag state is specified in the form data, we'll activate it in the interface.
   * This will only be called for subflagged widgets
   */
  setFlags: function(flag_state) {
    this._flagState = flag_state;

    if( flag_state.status == 'flagged' ) {
      this.element.find('input.missing_text').prop('checked', 'checked');
    } else if( flag_state.status == 'subflagged' ) {
      var flaggables = this.element.find('.word-flaggable');
      $.each( flag_state.flaggedIndices, function(idx, val) {
        $(flaggables[val]).addClass('flagged');
      });
    }

  },

  /**
   * Freeze this field (make it uneditable)
   */
  freeze: function() {
    if( this.options.jobtype == 'review' ) {
      this._flagState.status = 'frozen';
      this.element.removeClass('review');
    } else {
      this.element.find('textarea').attr('disabled', 'disabled');
    }
  },

  /**
   * Highlight certain items in this field that other workers have flagged.
   */
  highlight: function(indices) {
    // Add instructions about highlighting
    this.find('.highlight-instructions').show();

    var newText = [],
        wordIndex = 0,
        valueAsWordsAndSpaces = this._valueAsWordsAndSpaces(),
        wordOrSpace;

    // Scan through all words, and highlight the ones that need to be
    for( var i = 0; i < valueAsWordsAndSpaces.length; i++ ) {
      wordOrSpace = valueAsWordsAndSpaces[i];

      if( wordOrSpace.match(/\S+/) ) {
        // It's a word
        newText.push( indices.indexOf(wordIndex) !== -1 ? this._highlightedWord(wordOrSpace) : wordOrSpace )
        wordIndex++;
      } else {
        // It's a space
        newText.push( wordOrSpace );
      }
    }

    // Put a phantom <br> node in the div. This is to fix a problem where enter at the end of the
    // div would not work when it was the last character
    newText.push( "<br>" );

    this.find('textarea').replaceWith( this._generateHighlightableTextArea(newText.join('')) );
  },

  /**
   * Handle this element being clicked on in a review job
   */
  toggleFlag: function(el, ev) {
    if( ! this.model.subFlag ) {
      this._super(el, ev);
      return;
    }

    // Do stuff if we're subflagged
    if( $(ev.target).is('.missing_text') ) {

      this._flagState.status = this.element.find('input.missing_text').is(':checked') ? 'flagged' : 'unflagged';

    } else if( $(ev.target).is('.word-flaggable') ) {

      var wordIndex = $(ev.target).data('word-index');

      if( $(ev.target).hasClass('flagged') ) {
        $(ev.target).removeClass('flagged');

        // Remove this word index from the array
        var indexInArray = this._flagState.flaggedIndices.indexOf( wordIndex );
        if( indexInArray !== -1 ) {
          this._flagState.flaggedIndices.splice( indexInArray, 1 );
          this._flagState.flaggedWords.splice( indexInArray, 1 );
        }
      } else {
        $(ev.target).addClass('flagged');
        this._flagState.flaggedIndices.push( wordIndex );
        this._flagState.flaggedWords.push( $(ev.target).text() );
      }
    }
  },

  /*
   * Insert a newline character when enter is pressed
   */
  '.contentEditable keypress': function(el, ev) {
    if( ev.which == 13 ) {
      ev.preventDefault();

      var sel = window.getSelection(),
          range = sel.getRangeAt(0),
          newNode = document.createTextNode("\n");

      range.deleteContents();
      range.insertNode(newNode);

      range.setStartAfter(newNode);
      range.setEndAfter(newNode);

      sel.removeAllRanges();
      sel.addRange(range);
    }
  },

  beforeSubmit: function() {
    if( this.find('div.contentEditable').length == 0 ) return;

    this.element.append(
      $("<input/>")
        .attr('type', 'hidden')
        .attr('name', this.model.attr('name'))
        .val( this.find('div.contentEditable').text() )
    );
  },

  /*************************************************
   * PRIVATE METHODS
   *************************************************/

  _initializeSubFlaggedState: function() {
    var wordCount = this._valueWordCount();
    this._flagState.numItems = wordCount;

    if( wordCount > 0 ) {
      // Remove the checkbox that allows a worker to mark missing text
      this.find('.missing_text').remove();
      this._flagState.flaggedWords = [];
    } else {
      // There are no words present. We'll treat this as a normal flagged/unflagged widget
      this._flagState.status = 'unflagged';
      // Remove the instruction to click on each wrong word
      this.find('.click-instructions').remove();
    }
  },

  _valueWordCount: function() {
    var wordCount = 0,
        valueAsWordsAndSpaces = this._valueAsWordsAndSpaces();

    for( var i = 0; i < valueAsWordsAndSpaces.length; i++ ) {
      if( valueAsWordsAndSpaces[i].match(/\S+/) )
        wordCount++;
    }

    return wordCount;
  },

  /**
   * Return the initial value of this text area as a HTML string of tagged words
   * that can be subflagged
   * @hide
   */
  _valueAsTaggedWords: function() {
    var valueAsWordsAndSpaces = this._valueAsWordsAndSpaces(),
        wordOrSpace = null,
        container = $('<div/>'),  // Fake container to hold the HTML we generate
        wordIndex = 0;

    for( var i = 0; i < valueAsWordsAndSpaces.length; i++ ) {
      wordOrSpace = valueAsWordsAndSpaces[i];

      // Take the space as it is, or the tagged word
      container.append( wordOrSpace.match(/\s+/) ? wordOrSpace : this._taggedWord(wordOrSpace, wordIndex++) );
    }

    // Return the stuff that we want
    return container.contents();
  },

  _taggedWord: function(word, tag) {
    return $('<span/>').html(word).addClass('word-flaggable').data('word-index', tag);
  },

  _highlightedWord: function(word) {
    return "<b>" + word + "</b>";
  },

  _generateHighlightableTextArea: function(text) {
    return $('<div/>')
              .addClass('value contentEditable')
              .attr('contentEditable', true)
              .width(this.model.attr('width'))
              .height(this.model.attr('height') - this.find('.highlight-instructions').height())
              .html(text);
  },

  /**
   * Returns the initial text value of this widget as an array of words and spaces
   * @hide
   */
  _valueAsWordsAndSpaces: function() {
    // Memoize it.
    if( this.__valueAsWordsAndSpaces === null ) {
      this.__valueAsWordsAndSpaces = [];

      var match,
          text = this.__value;

      while( match = text.match(/\S+|\s+/) ) {
        this.__valueAsWordsAndSpaces.push(match[0]);
        text = text.replace(match[0], '');
      }
    }

    return this.__valueAsWordsAndSpaces;
  }

});

});

steal('../text_area/text_area', './views/show.ejs', './views/properties.ejs').then( function($) {

WizardFormBuilder.FormItem.TextArea.extend('WizardFormBuilder.FormItem.SegmentedTextArea', 
/* STATIC */
{
  // Node Types
  NODE_TEXT: 3
},
/* PROTOTYPE */
{  
  init: function() {
    this._super();
    
    if( this.options.jobtype == 'content' ) {
      // Find the controller for the audio widget. hacky?
      var audio_item_model = this.model.form.items.match('name', this.model.attr('audio'))[0];
      
      if( audio_item_model ) {
        var audio_item_controller = audio_item_model.elements().last().controller();
        audio_item_controller.subscribeToTimeUpdates( this.proxy('_audioTimeUpdate') );
      }
    }
  },

  /**
   * Set the value of this component for the content or review job
   */
  value: function(val) {
    // Cache the value we've been given
    this.__segmented_value = this.__value = val;
    
    if( val.length > 0 ) {
      this._first_timestamp = val[0].audio_begin_time;
    } else {
      this._first_timestamp = 0;
    }
    
    if( this.options.jobtype == 'review' ) {
      // call super with just the text all as one
      this._super(this._valueAsTextBlock());
    } else {
      this.find('.value').html( this._valueAsEditableSpans() );
    }
  },
  
  _valueAsTextBlock: function() {
    return $.map(this.__value, function(el, i) {
      return el.text;
    }).join('');
  },
  
  _valueAsEditableSpans: function() {
    var obj = $();

    $.each(this.__value, function(i, el) {
      obj = obj.add( 
        $('<span/>')
          .addClass('contentEditable')
          .attr('contentEditable', true)
          .data('timestamp', el.audio_begin_time)
          .html(el.text === '' ? '   ' : el.text)
      );
    });
    
    return obj;
  },
  
  _audioTimeUpdate: function(event) {
    var controller = this;
    
    $(this.find('span.contentEditable').get().reverse()).each( function(i, el) {
      
      if( ($(el).data('timestamp') - controller._first_timestamp) / 1000.0 < event.jPlayer.status.currentTime ) {

        if( ! $(el).hasClass('highlighted') ) {
          controller.find('span.contentEditable').removeClass('highlighted');
          $(el).addClass('highlighted');
        }
        
        return false;
      }
      
    });
  },
  
  /**
   * Highlight certain items in this field that other workers have flagged.
   */
  highlight: function(indices) {
    // Add instructions about highlighting
    this.find('.highlight-instructions').show();
    
    var wordIndex = 0,
        controller = this,
        text, match, wordOrSpace, newContents;
    
    this.find('span.contentEditable').each( function(i, el) {
      newContents = [];
      
      text = $(el).text();
      while( match = text.match(/\S+|\s+/) ) {
        wordOrSpace = match[0];
        if( wordOrSpace.match(/\s+/) ) {
          newContents.push(wordOrSpace)
          wordIndex++;
        } else {
          newContents.push( indices.indexOf(wordIndex) !== -1 ? controller._highlightedWord(wordOrSpace) : wordOrSpace );
        }
        
        text = text.replace(wordOrSpace, '');
      }
      
      
      $(el).html(newContents.join(''));
    });
  },
  
  beforeSubmit: function() {
    if( this.options.jobtype == 'content' ) {
      // Serialize the text by segment, with the original metadata that was passed in.
      var submitArray = this.__segmented_value;
      var spans = this.find('span.contentEditable');
      
      for( var i = 0; i < submitArray.length; i++ ) {
        submitArray[i].text = $(spans[i]).text();
      }
      
      this.element.append(
        $("<input/>")
          .attr('type', 'hidden')
          .attr('name', this.model.attr('name'))
          .val( $.toJSON(submitArray) )
      )
    }
  },
  
  /***************************************************
   * Hack Content Editable
   * All this shit below is ugly shit
   ***************************************************/

  // if lastMinusOne is true, we look to see if the cursor is after the second-to-last character, otherwise after the last character
  isLastCharacterHelper: function(elem, lastMinusOne) {
    var cursorPos;
  
    var subtractAmt = lastMinusOne ? 1 : 0;
  
    if (window.getSelection) {
      var selObj = window.getSelection();
    
      if( selObj.anchorNode == elem ) {
        return selObj.anchorOffset == (elem.childNodes.length - 1 - subtractAmt);
      }
      else {
        return selObj.anchorOffset == (selObj.anchorNode.length - subtractAmt) && (selObj.anchorNode == elem.lastChild || (this.isPhantomTextNode(elem.lastChild) && selObj.anchorNode == elem.lastChild.previousSibling))
      }
    }
    else if (document.selection) {    
      // ???
    }
  },

  isLastCharacter: function(elem) { return this.isLastCharacterHelper(elem, false); },
  isSecondToLastCharacter: function(elem) { return this.isLastCharacterHelper(elem, true); },

  isFirstCharacter: function(elem) {
    if (window.getSelection) {
      var selObj = window.getSelection();
    
      if( selObj.anchorNode == elem ) {
        return selObj.anchorOffset == 0 || (selObj.anchorOffset == 1 && this.isPhantomTextNode(selObj.anchorNode.firstChild));
      }
      else {
        return selObj.anchorOffset == 0 && (selObj.anchorNode == elem.firstChild || (this.isPhantomTextNode(elem.firstChild) && selObj.anchorNode == elem.childNodes[1]));
      }
    }
    else if (document.selection) {    
      // ???
    }
  },

  afterRight: function(el, ev) {
    if( this.isLastCharacter( el.get(0)) ) {
      var nextSpan = el.next('span[contentEditable=true]');
      if( nextSpan.length > 0 ) {
        nextSpan.focus();
        
        if( window.getSelection ) {
          var selObj = window.getSelection();
        
          if( selObj.rangeCount > 0 )
            selObj.removeAllRanges();
          var rangeObj = document.createRange();
        
          var fc = nextSpan.get(0).firstChild;
        
          while( this.isPhantomTextNode(fc) ) {
            fc = this.nextNode(fc);
            if( fc  == null ) return;
          }
        
          if( fc.nodeType == this.Class.NODE_TEXT ) {
            rangeObj.setStart(fc, 1);
          } else {
            rangeObj.setStartAfter(fc);
          }
        
          selObj.addRange(rangeObj);
          ev.preventDefault();
        }
        else if( document.selection ) {
        }
      }
    }
  },

  afterLeft: function(el, ev) {
    if( this.isFirstCharacter( el.get(0)) ) {
      var prevSpan = el.prev('span[contentEditable=true]');
      
      while( prevSpan.length > 0 && prevSpan.text().length == 0 ) {
        prevSpan = prevSpan.prev('span[contentEditable=true]');
      }
      
      if( prevSpan.length > 0 ) {
        prevSpan.focus();
        if( window.getSelection ) {
          var selObj = window.getSelection();
        
          if( selObj.rangeCount > 0 )
            selObj.removeAllRanges();
          var rangeObj = document.createRange();
        
          var lc = prevSpan.get(0).lastChild;
          
          while( lc && this.isPhantomTextNode(lc) ) {
            lc = this.prevNode(lc);
          }
          
          if( lc == null ) return;
        
          if( lc.nodeType == this.Class.NODE_TEXT )
            rangeObj.setStart(lc, lc.length - 1);
          else
            rangeObj.setStartBefore(lc);
        
          selObj.addRange(rangeObj);
          ev.preventDefault();
        }
        else if( document.selection ) {
        }
      }
    }
  },

  afterBackspace: function(el, ev) {
    if( this.isFirstCharacter( el.get(0) ) ) {
      var prevSpan = el.prev('span[contentEditable=true]');
      
      while( prevSpan.length > 0 && prevSpan.text().length == 0 ) {
        prevSpan = prevSpan.prev('span[contentEditable=true]');
      }
      
      if( prevSpan.length > 0 ) {
        var plc = prevSpan.get(0).lastChild;
      
        while( plc && this.isPhantomTextNode(plc) ) {
          plc = this.prevNode(plc);
        }
        
        if( plc  == null ) return;
      
        if( plc.nodeType == this.Class.NODE_TEXT ) {
          plc.nodeValue = plc.nodeValue.substring(0, plc.nodeValue.length-1);
        }
        else {
          plc.parentNode.removeChild(plc);
        }
      
        // move cursor to previous chunk
        // Firefox has an issue where if you set the cursor at the end of a node, 
        // it will insert text really weirdly
        if( !this.isFirefox() && window.getSelection ) {
          var selObj = window.getSelection();
    
          if( selObj.rangeCount > 0 )
            selObj.removeAllRanges();
          var rangeObj = document.createRange();
    
          var lc = prevSpan.get(0).lastChild;
    
          while( lc && this.isPhantomTextNode(lc) ) {
            lc = this.prevNode(lc);
          }
          
          if( lc  == null ) return;
    
          if( lc.nodeType == this.Class.NODE_TEXT )
            rangeObj.setStart(lc, lc.length);
          else
            rangeObj.setStartAfter(lc);
    
          selObj.addRange(rangeObj);
        }
        else if( document.selection ) {
          //
        }
      
        ev.preventDefault();
      }
    }
  },
  
  afterDelete: function(el, ev) {
    if( this.isLastCharacter( el.get(0)) ) {
      var nextSpan = el.next('span[contentEditable=true]');
      if( nextSpan.length > 0 ) {
        var nfc = nextSpan.get(0).firstChild;
      
        while( nfc && this.isPhantomTextNode(nfc) ) {
          nfc = this.nextNode(nfc);
        }
        
        if( nfc  == null ) return;
      
        if( nfc.nodeType == this.Class.NODE_TEXT ) {
          nfc.textContent = nfc.textContent.substring(1);
        }
        else {
          nfc.parentNode.removeChild(nfc);
        }
      }
    }
    else if( this.isFirefox() && this.isSecondToLastCharacter( el.get(0) ) ) {
      var selObj = window.getSelection();
    
      var n = selObj.anchorNode;
      if( n.nodeType == this.Class.NODE_TEXT ) {
        n.textContent = n.textContent.substring(0, n.textContent.length - 1)
      }
    
      if( selObj.rangeCount > 0 )
        selObj.removeAllRanges();
      var rangeObj = document.createRange();
      rangeObj.setStart(n, n.length);
      selObj.addRange(rangeObj);
    
      ev.preventDefault();
    }
  },
  
  isPhantomTextNode: function(node) {
    // Firefox hack (FF adds a phantom text node with empty content if the first child is actually another tag)
    // but also we don't want to be operating on empty text nodes generally
    return node.nodeType == this.Class.NODE_TEXT && node.textContent == "";
  },

  nextNode: function(node) {
    if( node.nextSibling !== null )
      return node.nextSibling;
    
    if( node.parentNode.nextSibling !== null )
      return node.parentNode.nextSibling.firstChild;
    
    return null;
  },

  prevNode: function(node) {
    if( node.previousSibling !== null )
      return node.previousSibling;
      
    if( node.parentNode.previousSibling !== null )
      return node.parentNode.previousSibling.lastChild;
    
    return null;
  },

  isFirefox: function() {
    return navigator.userAgent.indexOf("Firefox") != -1;
  },
  
  'span.contentEditable keydown': function(el, ev) {
    switch( ev.which ) {
      case 39:
        this.afterRight(el, ev);
        break;
      
      case 37:
        this.afterLeft(el, ev);
        break;
        
      case 8:
        this.afterBackspace(el, ev);
        break;

      case 46:
        this.afterDelete(el, ev);
        break;
    }
  }
});

});
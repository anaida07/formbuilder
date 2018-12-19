var DEBUG = false;

// NODE TYPES
var NODE_TEXT = 3;

// if lastMinusOne is true, we look to see if the cursor is after the second-to-last character, otherwise after the last character
function isLastCharacterHelper(elem, lastMinusOne) {
  var cursorPos;
  
  var subtractAmt = lastMinusOne ? 1 : 0;
  
  if (window.getSelection) {
    var selObj = window.getSelection();
    
    if( DEBUG )
      console.log(selObj);
    
    if( selObj.anchorNode == elem ) {
      return selObj.anchorOffset == (elem.childNodes.length - 1 - subtractAmt);
    }
    else {
      return selObj.anchorOffset == (selObj.anchorNode.length - subtractAmt) && (selObj.anchorNode == elem.lastChild || (isPhantomTextNode(elem.lastChild) && selObj.anchorNode == elem.lastChild.previousSibling))
    }
  }
  else if (document.selection) {    
    // ???
  }
}

function isLastCharacter(elem) { return isLastCharacterHelper(elem, false); }
function isSecondToLastCharacter(elem) { return isLastCharacterHelper(elem, true); }

function isFirstCharacter(elem) {
  if (window.getSelection) {
    var selObj = window.getSelection();
    
    if( DEBUG )
      console.log(selObj);

    if( selObj.anchorNode == elem ) {
      return selObj.anchorOffset == 0 || (selObj.anchorOffset == 1 && isPhantomTextNode(selObj.anchorNode.firstChild));
    }
    else {
      return selObj.anchorOffset == 0 && (selObj.anchorNode == elem.firstChild || (isPhantomTextNode(elem.firstChild) && selObj.anchorNode == elem.childNodes[1]));
    }
  }
  else if (document.selection) {    
    // ???
  }
}

function afterRight() {
  if( isLastCharacter($(this).get(0)) ) {
    var nextSpan = $(this).next("span.editable");
    if( nextSpan.length > 0 ) {
      $(nextSpan).focus();
      if( window.getSelection ) {
        var selObj = window.getSelection();
        
        if( selObj.rangeCount > 0 )
          selObj.removeAllRanges();
        var rangeObj = document.createRange();
        
        var fc = $(nextSpan).get(0).firstChild;
        
        while( isPhantomTextNode(fc) )
          fc = nextNode(fc);
        
        if( fc.nodeType == NODE_TEXT )
          rangeObj.setStart(fc, 1);
        else
          rangeObj.setStartAfter(fc);
        
        selObj.addRange(rangeObj);
        return false;
      }
      else if( document.selection ) {
      }
    }
  }
  return true;
}

function afterLeft() {
  if( isFirstCharacter($(this).get(0)) ) {
    var prevSpan = $(this).prev("span.editable");
    if( prevSpan.length > 0 ) {
      $(prevSpan).focus();
      if( window.getSelection ) {
        var selObj = window.getSelection();
        
        if( selObj.rangeCount > 0 )
          selObj.removeAllRanges();
        var rangeObj = document.createRange();
        
        var lc = $(prevSpan).get(0).lastChild;
        
        while( isPhantomTextNode(lc) )
          lc = prevNode(lc);
        
        if( lc.nodeType == NODE_TEXT )
          rangeObj.setStart(lc, lc.length - 1);
        else
          rangeObj.setStartBefore(lc);
        
        selObj.addRange(rangeObj);
        return false;
      }
      else if( document.selection ) {
      }
    }
  }
  return true;
}

function afterBackspace() {
  if( isFirstCharacter( $(this).get(0) ) ) {
    var prevSpan = $(this).prev("span.editable");
    if( prevSpan.length > 0 ) {
      var plc = prevSpan.get(0).lastChild;
      
      while( isPhantomTextNode(plc) )
        plc = prevNode(plc);
      
      if( plc.nodeType == NODE_TEXT ) {
        plc.nodeValue = plc.nodeValue.substring(0, plc.nodeValue.length-1);
      }
      else {
        plc.parentNode.removeChild(plc);
      }
      
      // move cursor to previous chunk
      // Firefox has an issue where if you set the cursor at the end of a node, 
      // it will insert text really weirdly
      if( !isFirefox() && window.getSelection ) {
        var selObj = window.getSelection();
    
        if( selObj.rangeCount > 0 )
          selObj.removeAllRanges();
        var rangeObj = document.createRange();
    
        var lc = $(prevSpan).get(0).lastChild;
    
        while( isPhantomTextNode(lc) )
          lc = prevNode(lc);
    
        if( lc.nodeType == NODE_TEXT )
          rangeObj.setStart(lc, lc.length);
        else
          rangeObj.setStartAfter(lc);
    
        selObj.addRange(rangeObj);
      }
      else if( document.selection ) {
        //
      }
      
      return false;
    }
  }
}

function afterDelete() {
  if( isLastCharacter($(this).get(0)) ) {
    var nextSpan = $(this).next("span.editable");
    if( nextSpan.length > 0 ) {
      var nfc = nextSpan.get(0).firstChild;
      
      while( isPhantomTextNode(nfc) )     
        nfc = nextNode(nfc);
      
      if( nfc.nodeType == NODE_TEXT ) {
        nfc.textContent = nfc.textContent.substring(1);
      }
      else {
        nfc.parentNode.removeChild(nfc);
      }
      
      // couldn't get below to work in FF
      
      // move cursor to beginning of next chunk
      // if( window.getSelection ) {
      //        var selObj = window.getSelection();
      //        
      //        if( selObj.rangeCount > 0 )
      //          selObj.removeAllRanges();
      //        var rangeObj = document.createRange();
      //        
      //        nfc = nextSpan.get(0).firstChild;
      //        while( isPhantomTextNode(nfc) )     
      //          nfc = nextNode(nfc);
      //        
      //        if( nfc.nodeType == 3 ) {
      //          rangeObj.setStart(nfc, 0);
      //          console.log(nfc)
      //        }
      //        else {
      //          rangeObj.setStartBefore(nfc);
      //        }
      //        
      //        selObj.addRange(rangeObj);
      //      }
      //      else if( document.selection ) {
      //      }
    }
  }
  else if( isFirefox() && isSecondToLastCharacter($(this).get(0))) {
    var selObj = window.getSelection();
    
    var n = selObj.anchorNode;
    if( n.nodeType == NODE_TEXT ) {
      n.textContent = n.textContent.substring(0, n.textContent.length - 1)
    }
    
    if( selObj.rangeCount > 0 )
      selObj.removeAllRanges();
    var rangeObj = document.createRange();
    rangeObj.setStart(n, n.length);
    selObj.addRange(rangeObj);
    
    return false;
  }
}

function isPhantomTextNode(node) {
  // Firefox hack (FF adds a phantom text node with empty content if the first child is actually another tag)
  // but also we don't want to be operating on empty text nodes generally
  return node.nodeType == NODE_TEXT && node.textContent == "";
}

function nextNode(node) {
  return (node.nextSibling == null ? node.parentNode.nextSibling.firstChild : node.nextSibling);
}

function prevNode(node) {
  return (node.previousSibling == null ? node.parentNode.previousSibling.lastChild : node.previousSibling);
}

function isFirefox() {
  return navigator.userAgent.indexOf("Firefox") != -1;
}

function isOpera() {
  return navigator.userAgent.indexOf("Opera") != -1;
}

$( function() {
  
  // bind enter to insert line-breaks in Firefox
  if( isFirefox() ) {
    $("span.editable").bind('keyup', 'return', function(e) { 
      var sel = window.getSelection();
      var range = sel.getRangeAt(0);
      range.deleteContents();
      var newNode = document.createElement("br");
      range.insertNode(newNode);
      range.setStartAfter(newNode);
    } );
  }
  
  $("span.editable").bind('keydown', 'right', afterRight)
                    .bind('keydown', 'left', afterLeft)
                    .bind('keydown', 'backspace', afterBackspace)
                    .bind('keydown', 'del', afterDelete);
  
});
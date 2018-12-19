/* Tracks mouse move and mouse up, and calls a function on
  each of those events with the difference from the original mousedown
  position */

$.Class( "MouseMoveTracker",
{
  
},

{
  init: function(jqEvent ) {
    this.x = jqEvent.clientX;
    this.y = jqEvent.clientY;
    
    var mmt = this;
    
    $(window).bind('mousemove', function(ev) {
      mmt.mousemove(ev.clientX - mmt.x, ev.clientY - mmt.y);
    });
    
    $(window).bind('mouseup', function(ev) { 
      $(window).unbind('mousemove').unbind('mouseup');
      mmt.mouseup(ev.clientX - mmt.x, ev.clientY - mmt.y);
    });
  },
  
  mousemove: function( diffX, diffY ) {},
  mouseup: function(diffX, diffY) {}
}
);
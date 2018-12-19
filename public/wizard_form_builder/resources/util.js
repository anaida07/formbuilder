WizardFormBuilder.Util = {
  
  newCoordSnapped: function(coord, gridUnit) {
    if( coord % gridUnit >= gridUnit / 2 )
      return coord + (gridUnit - coord % gridUnit);
    else
      return coord - (coord % gridUnit);
  }
  
}
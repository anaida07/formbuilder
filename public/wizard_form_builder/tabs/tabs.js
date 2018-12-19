/**
 * @class WizardFormBuilder.Tabs
 */
 
$.Controller('WizardFormBuilder.Tabs',
/* @Static */
{
  
},
/* @Prototype */
{
  init: function() {
    // activate the first tab
    this.activate( this.element.children("li:first") )

    // hide other tabs
    var tab = this.tab;
    this.element.children("li:gt(0)").each(function(){
      tab($(this)).hide();
    })
  },
  
  // helper function finds the tab for a given li
  tab: function(li) {
    return $(li.find('a').attr('href'));
  },
  
  // on an li click, activates new tab
  'li click': function(el, ev) {
    ev.preventDefault();
    this.activate(el);
  },
  
  // hides old active tab, shows new one
  'activate': function(el) {
    this.tab(this.find('.active').removeClass('active'))
        .hide();
    this.tab(el.addClass('active')).show();
  }  
  
});

;(function(){
  dojo.ready(function(){
    dojo.require('dojo.window');
    dojo.require('dojo.html');
    
    var footerId = 'footerid';
    
    dojo.addOnLoad(function(){
      var mvToBottom;
          
      mvToBottom = function(el){     
        dojo.create('div', {style: 'clear:both', id:'mvToBottom'}, dojo.body());
        var bodySize = dojo.marginBox(dojo.body()),
            windowSize = dojo.window.getBox(),
            change = {bottom:'0', clear:'', position:'absolute'};
        dojo.destroy('mvToBottom');
        if(windowSize.h < bodySize.h){
          change = {bottom:'', clear:'both', position:'relative'};
        }
        dojo.style(footerid, change);
      }
      
      // Position the footer
      mvToBottom(footerId);
      
      // Keep the footer at the bottom of the page
      dojo.connect(window, 'onresize', function(){
        mvToBottom(footerId);
      });      
    });
  });
})()
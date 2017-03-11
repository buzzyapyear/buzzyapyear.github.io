/* 
 * LI CONTROLLER
 */


var LIController = Class.create();

Object.extend(LIController.prototype, {
	initialize: function(obj){
		
		var liArray = document.getElementsByClassName('clickLI');
		
		for(i=0;i<liArray.length;i++){
			
			var currentLI = liArray[i];
		
			// set mouseover event
			Event.observe(currentLI, 'mouseover', function() 
				{
					Element.addClassName(this.item, 'hover')
				}
				.bindAsEventListener({obj:this, item:currentLI}));
				
				
			// set mouseout event
			Event.observe(currentLI, 'mouseout', function() 
				{
					Element.removeClassName(this.item, 'hover')
				}
				.bindAsEventListener({obj:this, item:currentLI}));
		}
		
	}

});
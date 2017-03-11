/* 
 * PAGE CONTROLLER
 */


var PageController = Class.create();

Object.extend(PageController.prototype, {
	initialize: function(obj){
		var dataRequest = new Ajax.Request('/xml/nav.xml', 
		 						{
		 							method:"GET", 
		 							onSuccess: this.initData.bind(this)
		 						});
	},
	
	initData: function(result){
		//Parse the page init data xml
		var xmlParent = result.responseXML;
		var xml = XML.getRootNode(result.responseXML);
		//var xml = xmlParent.childNodes[0];
		this.xmlArray = $NL(xml.childNodes).elements();
		this.xmlArrayCount = $NL(xml.childNodes).elements().length;
		this.title = new Array();
		this.contentURL = new Array();
		this.contentID = new Array();
		
		for(i=0;i<this.xmlArrayCount;i++){
			this.title[i] = $NL(this.xmlArray[i].childNodes).elements()[0].firstChild.data;
			this.contentURL[i] = $NL(this.xmlArray[i].childNodes).elements()[1].firstChild.data;
			this.contentID[i] = $NL(this.xmlArray[i].childNodes).elements()[2].firstChild.data;
		}
		
		var initContent = new Ajax.Updater('contentHome', '/content/home.html',
									{
										method: 'GET',
										onComplete: function()
												{ 
													$('contentHome').style.visibility = 'visible'; 
													Effect.AppearCYap('contentHome',{duration:.5});
												}
									});
		this.initNav(this);
	},
	
	initNav: function(){
		// loop through nav data and render navigation
		for(i=0;i<this.xmlArrayCount;i++) {
			var navItem = document.createElement('li');
			var currentContent = this.contentURL[i];
			navItem.innerHTML = this.title[i];
			$('nav').appendChild(navItem);
			var navSelect = document.createElement('div');
			$(navItem).appendChild(navSelect);
			
			// set click event
			Event.observe(navItem, 'mouseup', function() 
				{
					this.obj.handleNavClick(this.currentContent, this.currentID, this.item)
				}
				.bindAsEventListener({obj:this, currentContent:this.contentURL[i], currentID:this.contentID[i], item:navItem}));
			
			//set initial select state
			if(i==0) {  
				Element.addClassName(navItem, 'selected'); 
			};
			
			// set mouseover event
			Event.observe(navItem, 'mouseover', function() 
				{
					Effect.AppearCYap(this.select,{duration:.25, from:0, to:.2});
				}
				.bindAsEventListener({obj:this, item:navItem, select:navSelect}));
				
			// set mouseout event
			Event.observe(navItem, 'mouseout', function() 
				{
					Effect.FadeCYap(this.select,{duration:.25, from:.2, to:0});
				}
				.bindAsEventListener({obj:this, item:navItem, select:navSelect}));
			
		};

/*		
// begin moo experiment
var list = $$('#nav li');
list.each(function(element) {
 
	var fx = new Fx.Styles(element, {duration:200, wait:false});
 
	Event.observe(element, 'mouseover', function(){
		fx.start({
			'margin-left': [5, 10]
		});
	});
 
	Event.observe(element, 'mouseout', function(){
		fx.start({
			'margin-left': [10, 5]
		});
	});
 
});
			
// end moo experiment
*/	
		
		
	},
	
	handleNavClick: function(currentContent, currentID, navItem){
		// set nav state
		var navArray = document.getElementsByClassName('selected');
		for(i=0;i<navArray.length;i++){
			Element.removeClassName(navArray[i], 'selected');
		}
		Element.addClassName(navItem, 'selected');
		
		// set content and handle transition
		var oldContentContainer = document.getElementsByClassName('contentContainer')[0];
		var newContentContainerID = 'content' + currentID;
		var newContentContainer = document.createElement('div');
		newContentContainer.id = newContentContainerID;
		$('content').appendChild(newContentContainer);
		Element.addClassName(newContentContainer, 'contentContainer');
		var contentUpdater = new Ajax.Updater(newContentContainerID, currentContent, 
										{
											method: 'GET',
											onComplete: function()
												{ 
													 
													
													Effect.FadeCYap(oldContentContainer.id,{duration:0.5});
													$(newContentContainer).style.visibility = 'visible';
													Effect.AppearCYap(newContentContainer.id,{duration:.5});
													$(oldContentContainer).style.visibility = 'hidden';
													$('content').removeChild(oldContentContainer);
													
												}
										});

		
	}

});
/* 
 * PAGE CONTROLLER
 */


var PageController = Class.create();

Object.extend(PageController.prototype, {
	initialize: function(obj){
	
		// fade out loading div
		Event.observe(window, 'load', function()
			{
				setTimeout("Effect.Fade('initLoadingDiv',{duration:0.5})", 500);
			});
	
		// get data
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
		
		// split URL and check query string for robots and SEO
		this.url = String(window.location);
		//this.url = ru;
		//alert(ru.split("/")[1]);
		this.splitURL = this.url.split(".com/")[1];
		this.contentPath = '/content/home.html';
		this.contentDivID = 'contentHome';
		if(this.splitURL != null && this.splitURL != '') {
			this.contentPath = '/content/' + this.splitURL + '.html';
			this.splitURL = this.convert2TitleCase(this.splitURL);
			this.contentDivID = 'content' + this.splitURL;
		}
		
		var initContentDiv = document.createElement('div');
		$('content').appendChild(initContentDiv);
		initContentDiv.id = this.contentDivID;
		Element.addClassName(initContentDiv, 'contentContainer');
		
		// populate init content
		var initContent = new Ajax.Updater(this.contentDivID, this.contentPath,
									{
										method: 'GET',
										onComplete: function()
												{
													initContentDiv.style.visibility = 'visible'; 
													Effect.AppearCYap(initContentDiv,{duration:.5});
													
													// handle pages with li content
													var lc = new LIController;
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
			
			// set mouseover event
			Event.observe(navItem, 'mouseover', function() 
				{
					Element.addClassName(this.item, 'hover')
				}
				.bindAsEventListener({obj:this, item:navItem}));
				
			// set mouseout event
			Event.observe(navItem, 'mouseout', function() 
				{
					Element.removeClassName(this.item, 'hover')
				}
				.bindAsEventListener({obj:this, item:navItem}));
			
			// set click event
			Event.observe(navItem, 'mouseup', function() 
				{
					this.obj.handleNavClick(this.currentContent, this.currentID, this.item)
				}
				.bindAsEventListener({obj:this, currentContent:this.contentURL[i], currentID:this.contentID[i], item:navItem}));
			
			//set initial select state
			if(this.splitURL != null && this.splitURL != '') {
				if(this.contentID[i] == this.splitURL) {
					Element.addClassName(navItem, 'selected'); 
				}
			}
			else {
				if(i == 0) {
					Element.addClassName(navItem, 'selected'); 
				}
			}
			
		};
		
	},
	
	handleNavClick: function(currentContent, currentID, navItem){
		// set nav state
		var navArray = document.getElementsByClassName('selected');
		var samePage = false;
		for(i=0;i<navArray.length;i++){
			if(navArray[i] == navItem){
				samePage = true;
			}
			Element.removeClassName(navArray[i], 'selected');
		}
		Element.addClassName(navItem, 'selected');
		
		// set content and handle transition
		if(samePage != true) {
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
													
													// handle pages with li content
													var lc = new LIController;
													
												}
										});
		}
		
		
		
		
	},
	
	convert2TitleCase: function(str) {
        return str.toLowerCase().replace(/\b[a-z]/g, cnvrt);
        function cnvrt() {
            return arguments[0].toUpperCase();
        }
    }


});
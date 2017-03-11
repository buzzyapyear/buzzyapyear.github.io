/**
 * Modal Backdrop: This is the semi-transparent white backdrop that goes between
 * 		a popup panel and the main page.
 */
var ModalBackdrop = Class.create();
Object.extend(ModalBackdrop.prototype, {
	initialize: function(element, opts){
		element = (element) ? $(element) : element;
		this.opts = opts || {};
		this.isFlashHidden = false;	
		this.scrollers = [];
		if($('modalBackdrop') && !element){
			this.element = $('modalBackdrop');
		}
		else{
			//Prepare Modal Backdrop Div
			this.container_element = element;
			this.element = document.createElement('div');
			this.element.style.zIndex = 100;
			if(!this.container_element){
				this.element.id = 'modalBackdrop';
			}
			if(document.all)
				this.element.className = 'modalBackdropIE';
			else
				this.element.className = 'modalBackdrop';
			this.element.style.display = 'none';
			//If the user resizes the window, make sure the modal backdrop still covers the whole page
			Event.observe(window, 'resize', this.resize.bind(this));
			Event.observe(window, 'scroll', this.resize.bind(this));
			
			this.attach();
		}
		
		Event.observe(this.element, 'click', this.handleClick.bindAsEventListener(this));
	},
	attach: function(){
		if(document.body){
			if(this.container_element){
				this.container_element.appendChild(this.element);
			}
			else{
				document.body.appendChild(this.element);
			}
		}
		else{
			Event.observe(window, 'load', function(){
				if(this.container_element){
					this.container_element.appendChild(this.element);
				}
				else{
					document.body.appendChild(this.element);
				}
			}.bind(this));
		}
	},
	resize: function(){
		if(this.container_element){
			this.element.style.height = this.container_element.offsetHeight + 'px';
			this.element.style.width = this.container_element.offsetWidth + 'px';
		}
		else{
			//have to shrink the backdrop so we can get the new scrollHeight
			this.element.style.width = document.documentElement.offsetWidth + 'px';
			//make sure the backdrop covers the whole page
			this.element.style.width = document.documentElement.scrollWidth + 'px';

			if(document.documentElement.scrollHeight){
				//have to shrink the backdrop so we can get the new scrollHeight
				this.element.style.height = document.documentElement.offsetHeight + 'px';
				//make sure the backdrop covers the whole page
				var ps = this.getPageSize();
				var height = ps[1] > document.documentElement.scrollHeight ? ps[1] : document.documentElement.scrollHeight;
				this.element.style.height = height + 'px';
			}
			else{
				this.element.style.height = window.innerHeight + window.scrollY + 'px';
			}
		}
	},
	getPageSize: function(){
		
		var xScroll, yScroll;
		
		if (window.innerHeight && window.scrollMaxY) {	
			xScroll = document.body.scrollWidth;
			yScroll = window.innerHeight + window.scrollMaxY;
		} else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
			xScroll = document.body.scrollWidth;
			yScroll = document.body.scrollHeight;
		} else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
			xScroll = document.body.offsetWidth;
			yScroll =  document.body.offsetHeight;
		}
		
		var windowWidth, windowHeight;
		if (self.innerHeight) {	// all except Explorer
			windowWidth = self.innerWidth;
			windowHeight = self.innerHeight;
		} else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
			windowWidth = document.documentElement.clientWidth;
			windowHeight = document.documentElement.clientHeight;
		} else if (document.body) { // other Explorers
			windowWidth = document.body.clientWidth;
			windowHeight = document.body.clientHeight;
		}	
		
		// for small pages with total height less then height of the viewport
		if(yScroll < windowHeight){
			pageHeight = windowHeight;
		} else { 
			pageHeight = yScroll;
		}
	
		// for small pages with total width less then width of the viewport
		if(xScroll < windowWidth){	
			pageWidth = windowWidth;
		} else {
			pageWidth = xScroll;
		}
	
	
		arrayPageSize = new Array(pageWidth,pageHeight,windowWidth,windowHeight);
		return arrayPageSize;
	},	
	enable: function(){
		this.element.style.display = 'block';
		this.resize();
		
		$NL(document.getElementsByClassName('scroller', this.container_element)).each(function(e){
			if(e.style.display != 'none'){
				e.style.display = 'none';
				this.scrollers.push(e);
				return true;
			}
			return false;
		}.bind(this));
		if(!this.container_element){
			this.hideAllFlashInSafari();
		}
	},
	disable: function(){
		this.element.style.display = 'none';
		while(e = this.scrollers.shift()){
			e.style.display = '';
		}
		if(!this.container_element){
			this.showAllFlashInSafari();
		}
	},
	hideAllFlashInSafari: function() {
		try{
			if (!this.isFlashHidden){
				var flashObjs = $A(document.getElementsByTagName('OBJECT')).concat($A(document.getElementsByTagName('EMBED')));

				flashObjs.each(function(flashObj) {
					flashObj.parentNode.style.visibility   = 'hidden';	
				});
				this.isFlashHidden = true;
			}
		} catch(e) {}
	},
	showAllFlashInSafari: function() {
		try{
			if (this.isFlashHidden){
				var flashObjs = $A(document.getElementsByTagName('OBJECT')).concat($A(document.getElementsByTagName('EMBED')));

				flashObjs.each(function(flashObj) {
					flashObj.parentNode.style.visibility = 'visible';		
				});
				this.isFlashHidden = false;
			}
		} catch(e) {}
	},
	isMacBrowser: function() {
		if(navigator.userAgent.toLowerCase().indexOf('mac') > -1) {
			return true;	
		}
		return false;
	},
	handleClick: function(event){
		if(this.opts.onClick){
			this.opts.onClick(event);
		}
	}
	
});
/**
 * Contact List Controller - Hello Google!
 * @author Chris Yap
 */

var ContactListController = Class.create();

Object.extend(ContactListController.prototype, {
	initialize: function(obj){
		
		// wait for full page load then show contact list
		Event.observe(window, 'load', function()
			{
				setTimeout("$('contact_list_wrapper').style.visibility = 'visible'", 300);
				setTimeout("$('loading_div').style.display = 'none'", 500);
			});
		
		// get data
		var dataRequest = new Ajax.Request('/goog/xml/contact_list.xml', 
		 						{
		 							method:"GET", 
		 							onSuccess: this.initData.bind(this)
		 						});
	},
	
	initData: function(result){
		//Parse the contact list init data xml and set variables
		var XML = {};
		var xmlParent = result.responseXML;
		var xml = this.getRootNode(result.responseXML);
		this.xmlArray = $NL(xml.childNodes).elements();
		this.xmlArrayCount = $NL(xml.childNodes).elements().length;
		this.name = new Array();
		this.email = new Array();
		this.phone = new Array();
		this.address = new Array();
		this.city = new Array();
		this.state = new Array();
		this.zip = new Array();
		this.avatarURL = new Array();
		for(i=0;i<this.xmlArrayCount;i++){
			this.name[i] = $NL(this.xmlArray[i].childNodes).elements()[0].firstChild.data;
			this.email[i] = $NL(this.xmlArray[i].childNodes).elements()[1].firstChild.data;
			this.phone[i] = $NL(this.xmlArray[i].childNodes).elements()[2].firstChild.data;
			this.address[i] = $NL(this.xmlArray[i].childNodes).elements()[3].firstChild.data;
			this.city[i] = $NL(this.xmlArray[i].childNodes).elements()[4].firstChild.data;
			this.state[i] = $NL(this.xmlArray[i].childNodes).elements()[5].firstChild.data;
			this.zip[i] = $NL(this.xmlArray[i].childNodes).elements()[6].firstChild.data;
			this.avatarURL[i] = $NL(this.xmlArray[i].childNodes).elements()[7].firstChild.data;
		};
		
		// initialize contact list and populate data
		for(i=0;i<this.xmlArrayCount;i++){
			
			// initialize list item
			var list_item = document.createElement('li');
			$('contact_list').appendChild(list_item);
			Element.addClassName(list_item, 'contact_list_item');
			
			// initialize name
			var list_item_name = document.createElement('div');
			list_item.appendChild(list_item_name);
			list_item_name.innerHTML = this.name[i];
			Element.addClassName(list_item_name, 'contact_info_name')
			
			// initialize short info
			var list_item_short_info = document.createElement('div');
			list_item.appendChild(list_item_short_info);
			Element.addClassName(list_item_short_info, 'contact_info_short');
			var list_item_short_info_email = document.createElement('div');
			list_item_short_info.appendChild(list_item_short_info_email);
			list_item_short_info_email.innerHTML = this.email[i]; 
			Element.addClassName(list_item_short_info_email, 'email');
			var list_item_short_info_phone = document.createElement('div');
			list_item_short_info.appendChild(list_item_short_info_phone);
			list_item_short_info_phone.innerHTML = this.phone[i];
			Element.addClassName(list_item_short_info_phone, 'phone');
			
			// initialize full info
			var list_item_full_info = document.createElement('div');
			list_item.appendChild(list_item_full_info);
			Element.addClassName(list_item_full_info, 'contact_info_full');
			var list_item_full_info_avatar = document.createElement('div');
			list_item_full_info.appendChild(list_item_full_info_avatar);
			Element.addClassName(list_item_full_info_avatar, 'contact_info_avatar');
			var list_item_full_info_avatar_img = document.createElement('img');
			list_item_full_info_avatar.appendChild(list_item_full_info_avatar_img);
			list_item_full_info_avatar_img.src = this.avatarURL[i];
			var full_info_string = this.email[i] + '<br/>' + this.phone[i] + '<br/>' + this.address[i] + ' - <a href="#">Map</a>' + '<br/>' + this.city[i] + ',&nbsp;' + this.state[i] + '&nbsp;' + this.zip[i] + '<br/><a href="#">Chats</a> - <a href="#">Emails</a>'; 
			var insert_full_info = new Insertion.Bottom(list_item_full_info, full_info_string);	
			
		};
	
		this.setContactListEvents(this);
	},
	
	setContactListEvents: function(){
		var all_contact_list_items = document.getElementsByClassName('contact_list_item');
		for(i=0;i<all_contact_list_items.length;i++) {
			
			// set mouseover event
			Event.observe(all_contact_list_items[i], 'mouseover', function() 
				{
					Element.addClassName(this.item, 'hover');
					Element.addClassName($('contact_list'), 'backdrop');
				}
				.bindAsEventListener({obj:this, item:all_contact_list_items[i]}));
			
			// set mouseover event
			Event.observe(all_contact_list_items[i], 'mouseout', function() 
				{
					Element.removeClassName(this.item, 'hover');
					Element.removeClassName($('contact_list'), 'backdrop');
				}
				.bindAsEventListener({obj:this, item:all_contact_list_items[i]}));
			
		};
		
		if(IESelectFix==true){
			this.IEFormsFix();
		}
		
	},
	
	getRootNode: function(responseXML){ 
	    switch(responseXML.childNodes.length){
	        case 1: return responseXML.childNodes[0]; break;
	        case 2: return responseXML.childNodes[1]; break;
	        default: return false; break;
	    }
	},
	
	IEFormsFix: function() {
		// apply IE Select Fix
		var full_info_divs = document.getElementsByClassName('contact_info_full');
		for(i=0;i<full_info_divs.length;i++){
			var current_width = full_info_divs[i].offsetWidth;
			var current_height = full_info_divs[i].offsetHeight;
			var frame_fix = document.createElement('iframe');
			full_info_divs[i].appendChild(frame_fix);
			frame_fix.style.width = current_width + 'px';
			frame_fix.style.height = current_height + 'px';
		}
	},
	
	swapEmailPhone: function(){
		var emails = document.getElementsByClassName('email');
		var phones = document.getElementsByClassName('phone');
		if(document.contact_list_pulldown_form.contact_list_pulldown.selectedIndex == 0){
			for(i=0;i<emails.length;i++){
				emails[i].style.display = 'block';
				phones[i].style.display = 'none';
			}
		}
		else if(document.contact_list_pulldown_form.contact_list_pulldown.selectedIndex == 1){
			for(i=0;i<emails.length;i++){
				emails[i].style.display = 'none';
				phones[i].style.display = 'block';
			}
		}
	}


});

var ContactList = new ContactListController;
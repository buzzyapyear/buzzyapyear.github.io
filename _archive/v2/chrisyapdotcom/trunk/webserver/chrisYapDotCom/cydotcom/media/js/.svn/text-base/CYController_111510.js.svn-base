/* 
 * ChrisYap.com Application Controller
 * @author Chris Yap
 */
var CYController = Class.create();

Object.extend(CYController.prototype, {
	initialize: function() {
		Event.observe(window, 'load', function() {
			this.fixPngs();
		}.bind(this));
	},
	
	/* BEGIN IE PNG FIX */
	fixPngs: function() {
		//	this will iterate with each element with the class 'ie-fix-opacity' and add an IE filter,
		//	replacing the background-image for the filter of that image
		var version = parseFloat(navigator.appVersion.split('MSIE')[1]);
		if ((version >= 5.5) && (version < 7) && (document.body.filters)) {
			$$('.').each(function(poElement){
				// if IE5.5+ on win32, then display PNGs with AlphaImageLoader
				var cBGImg = poElement.currentStyle.backgroundImage;
				var cImage = cBGImg.substring(cBGImg.indexOf('"') + 1, cBGImg.lastIndexOf('"'));
				if (poElement.currentStyle.backgroundRepeat == 'repeat-x' || poElement.currentStyle.backgroundRepeat == 'repeat-y') {
					var sizingMethod = 'scale';
				}
				else {
					var sizingMethod = 'crop';
				}
				poElement.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + cImage + "', sizingMethod='" + sizingMethod + "')";
				poElement.style.backgroundImage = "none";
			});
			$$('img.').each(function(poElement){
				poElement.runtimeStyle.backgroundImage = "none";
				poElement.runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + poElement.src + "', sizingMethod='image')";
				poElement.src = '/images/spacer.gif';
			});
		}
	},
	/* END IE PNG FIX */
	
	// FLICKR METHODS - TODO[cyap] - deprecated in favor of python methods, get rid of this...?
	embedFlickr: function() {
		
		this.flickrSettings =  {
			apiKey: '60cda4a2cdaf876686b71e82dfde3265',
			userID: '52033098%40N00',
			tags: 'portfolioSite',
			itemsToShow: 5,
			timeToWait : 0,
			flickrContainer: 'flickrContainer'
		}
		
		var head = document.getElementsByTagName("head")[0];
		this.flickrContainer = $(this.flickrSettings.flickrContainer);

		var flickrJSON = document.createElement("script");
		flickrJSON.type = "text/javascript";
		flickrJSON.src = ['http://api.flickr.com/services/rest/?format=json&jsoncallback=cyc.constructFlickrItems&method=flickr.photos.search&tags=', this.flickrSettings.tags, '&user_id=', this.flickrSettings.userID, '&per_page=100&api_key=', this.flickrSettings.apiKey].join('');
		head.appendChild(flickrJSON);

		var wait = setTimeout(function () {
			flickrJSON.onload = null;
			flickrJSON.parentNode.removeChild(flickrJSON);
			flickrJSON = null;
		}, this.flickrSettings.timeToWait);
		
		return {
			constructFlickrItems : this.constructFlickrItems
		}
		
	},
	
	constructFlickrItems: function(json) {

		var photos = json.photos,
			list = document.createElement("ul"), 
			listItem,
			photo,
			photoURL,
			listItem,
			randomNumber;
		
		for (var i=0; i < this.flickrSettings.itemsToShow; i++) {
			randomNumber = Math.floor(Math.random()*json.photos.photo.length+1);
			photo = json.photos.photo[randomNumber];
			photoURL = ['http://farm', photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '.jpg'].join('');
			listItem = document.createElement("li");
			listItem.innerHTML = ['<img src="', photoURL, '" class="flickrPhoto" border="0" />'].join('');
			list.appendChild(listItem);
		}
		
		this.flickrContainer.appendChild(list);
		
		console.log('done');
	},
	
	// TUMBLR METHODS - TODO[cyap] - deprecated in favor of python methods, get rid of this...?
	// tumblrBadge by Robert Nyman, http://www.robertnyman.com/, http://code.google.com/p/tumblrbadge/
	// Prototype.js port by Chris Yap
	embedTumblr: function () {
		// User settings

		this.tumblrSettings = {
			userName : "buzzyapyear", // Your Tumblr user name
			itemsToShow : 6, // Number of Tumblr posts to retrieve
			tumblrContainer : "tumblrContainer", // Id of HTML element to put badge code into
			imageSize : 250, // Values can be 75, 100, 250, 400 or 500
			shortPublishDate : true, // Whether the publishing date should be cut shorter
			timeToWait : 0 // Milliseconds, 1000 = 1 second
		};

		// Badge functionality
		var head = document.getElementsByTagName("head")[0];
		this.tumblrContainer = $(this.tumblrSettings.tumblrContainer);

		var tumblrJSON = document.createElement("script");
		tumblrJSON.type = "text/javascript";
		tumblrJSON.src = ['http://', this.tumblrSettings.userName, '.tumblr.com/api/read/json?callback=cyc.constructTumblrItems&tagged=portfolioSite&num=', this.tumblrSettings.itemsToShow].join('');
		head.appendChild(tumblrJSON);

		var wait = setTimeout(function () {
			tumblrJSON.onload = null;
			tumblrJSON.parentNode.removeChild(tumblrJSON);
			tumblrJSON = null;
		}, this.tumblrSettings.timeToWait);
		
		return {
			constructTumblrItems : this.constructTumblrItems
		}
		
	},

	constructTumblrItems: function (json) {
		var posts = json.posts,
			list = document.createElement("ul"), 
			post, 
			listItem, 
			contentContainer,
			moreElement,
			text, 
			link, 
			img, 
			conversation, 
			postLink;
		list.className = "tumblr";
		for (var i=0, il=posts.length; i<il; i=i+1) {
			post = posts[i];

			// Only get content for text, photo, quote and link posts
			if (/regular|photo|quote|link|conversation/.test(post.type)) {
				listItem = document.createElement("li");
				contentContainer = document.createElement("div");
				contentContainer.className = "tumblrPost";
				text = post["regular-body"] || post["photo-caption"] || post["quote-source"] || post["link-text"] || post["link-url"] || "";
				if (post.type === "photo") {
					link = document.createElement("a");
					link.href = post.url;
					img = document.createElement("img");
					// To avoid a creeping page
					img.width = this.tumblrSettings.imageSize;
					img.src = post["photo-url-" + this.tumblrSettings.imageSize];
					link.appendChild(img);
					contentContainer.appendChild(link);
					text = "<em>" + text + "</em>";
				}
				else if (post.type === "quote") {
					text = post["quote-text"] + "<em>" + text + "</em>";
				}
				else if (post.type === "link") {
					text = '<a href="' + post["link-url"] + '">' + text + '</a>';
				}
				else if (post.type === "conversation") {
					conversation = post["conversation-lines"];
					for (var j=0, jl=conversation.length; j<jl; j=j+1) {
						text += conversation[j].label + " " + conversation[j].phrase + ((j === (jl -1))? "" : "<br>");
					}
				}
				contentContainer.innerHTML += text;

				// Create a link to Tumblr post
				// postLink = document.createElement("a");
				// postLink.className = "tumblr-post-date";
				// postLink.href = post.url;
				// postLink.innerHTML = (this.tumblrSettings.shortPublishDate)? post["date"].replace(/(^\w{3},\s)|(:\d{2}$)/g, "") : post["date"];
				// contentContainer.appendChild(postLink);
				moreElement = document.createElement("div");
				moreElement.innerHTML += '<div><a href="' + post.url + '" target="_blank">More &raquo;</a>';

				// Apply list item to list
				listItem.appendChild(contentContainer);
				listItem.appendChild(moreElement);
				list.appendChild(listItem);
			}
		}

		// Apply list to container element
		this.tumblrContainer.appendChild(list);
	},
	
	// UTILITY METHODS
	getDocHeight: function() {
	    var D = document;
	    return Math.max(
	        Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
	        Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
	        Math.max(D.body.clientHeight, D.documentElement.clientHeight)
	    );
	}
});
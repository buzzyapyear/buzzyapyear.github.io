/* 
 * ChrisYap.com Application Controller
 * @author Chris Yap
 */
cy.CYController = function() {
    
}

cy.CYController.prototype = {
	
	embedFlickr: function(flickrOptions) {
		this.flickrOptions = {
    	    apiKey: '60cda4a2cdaf876686b71e82dfde3265',
			userID: '52033098%40N00',
			tags: 'portfolioSite',
			itemsToShow: 5,
			timeToWait: 0,
			flickrSize: 'Medium',
			imgSize: 248
        }
        $.extend(this.flickrOptions, flickrOptions);
		
        var jsonPath = ['http://api.flickr.com/services/rest/?format=json&jsoncallback=?&method=flickr.photos.search&tags=', this.flickrOptions.tags, '&user_id=', this.flickrOptions.userID, '&per_page=100&api_key=', this.flickrOptions.apiKey].join('');
        $.getJSON(jsonPath, function(json) {
            this.constructFlickrItems(json);
        }.bindScope(this));
	},
	
	constructFlickrItems: function(json) {
		
		var photosArray = [];
		var container = $('#flickrContainer ul');
		if (!cy.appVars.isMobile) {
		    var marker = E('li', 'module marker',
    	        E('h1', 'hide', T('Flickr')),
    	        E('img').attr({
    	            'src': [cy.appVars.mediaUrl, 'cydotcom/images/markerFlickr.png'].join(''),
    	            'alt': 'Flickr',
    	            'title': 'Flickr',
    	            'border': '0'
    	        })
    		).attr('id', 'markerFlickr');
    	    $(container).append(marker);
		};
		
		for (var i=0; i < this.flickrOptions.itemsToShow; i++) {
			var randomNumber = Math.floor(Math.random()*json.photos.photo.length+1);
			var photo = json.photos.photo[randomNumber];
			photosArray.push(photo);
		}
		
		$.each(photosArray, function(i, photo) {
		    var getSizePath = ['http://api.flickr.com/services/rest/?format=json&jsoncallback=?&method=flickr.photos.getSizes&photo_id=', photo.id, '&api_key=', this.flickrOptions.apiKey].join('');
		    $.getJSON(getSizePath, function(res){
		        var photoUrl = ['http://farm', photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '.jpg'].join('');
    			var sizes = res.sizes.size;
    			$.each(sizes, function(i, size) {
    			    if (size.label == this.flickrOptions.flickrSize) {
                         var img = E('img', 'flickrPhoto').attr({
                             'src': photoUrl,
                             'border': '0'
                         });
                         if (size.width > size.height) {
                             $(img).attr('height', this.flickrOptions.imgSize).addClass('flickrHoriz');
                         }
                         else {
                             $(img).attr('width', this.flickrOptions.imgSize).addClass('flickrVert');
                         }
                         var link = E('a', img).attr('title', photo.title);
                         if (cy.appVars.isMobile) {
                            $(link).attr({
                                'href': ['/mobileFlickrDialog/', photo.farm, '/', photo.server, '/', photo.id, '/', photo.secret].join(''),
                                'data-rel': 'dialog',
                                'data-transition': 'pop'
                            });
                         }
                         else {
                             $(link).attr({
                                 'href': photoUrl,
                                 'rel': 'lightbox[\'flickr\']'
                             }); 
                         }
                         $(container).append(E('li', link));
                    }
    			}.bindScope(this));
		    }.bindScope(this));
		}.bindScope(this));
	},
	
	// TUMBLR METHODS - TODO[cyap] - deprecated in favor of python methods, get rid of this...?
	// tumblrBadge by Robert Nyman, http://www.robertnyman.com/, http://code.google.com/p/tumblrbadge/
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
		
		var jsonPath = ['http://', this.tumblrSettings.userName, '.tumblr.com/api/read/json?callback=?&tagged=portfolioSite&num=', this.tumblrSettings.itemsToShow].join('');
        $.getJSON(jsonPath, function(json) {
            this.constructTumblrItems(json);
        }.bindScope(this));
		
	},

	constructTumblrItems: function (json) {
		var posts = json.posts;
	    var container = $('#tumblrContainer ul');
		if (!cy.appVars.isMobile) {
		    var marker = E('li', 'module marker',
    	        E('h1', 'hide', T('Tumblr')),
    	        E('img').attr({
    	            'src': [cy.appVars.mediaUrl, 'cydotcom/images/markerTumblr.png'].join(''),
    	            'alt': 'Tumblr',
    	            'title': 'Tumblr',
    	            'border': '0'
    	        })
    		).attr('id', 'markerTumblr');
    	    $(container).append(marker);
		}
		
		for (var i=0, il=posts.length; i<il; i=i+1) {
			var post = posts[i];

			// Only get content for text, photo, quote and link posts
			if (/regular|photo|quote|link|conversation/.test(post.type)) {
				var contentContainer = E('div', 'tumblrPost');
				switch (post.type) {
				    case 'photo':
				        var img = E('img').attr({
    					    'src': post[['photo-url-', this.tumblrSettings.imageSize].join('')],
    					    'border': 0
    					});
    					var link = E('a', img).attr({
    					    'href': post.url,
    					    'target': '_blank' 
    					});
    					var text = post['photo-caption'];
    					$(contentContainer).append(link).append(text);
				        break;
				    
				    case 'quote':
				        var quote = E('span', 'quote', T(post['quote-text']));
    					var source = E('span', 'source', T('- ')).append(post['quote-source']);
    					$(contentContainer).addClass('tumblrQuote').append(quote).append(source);
				        break;
				    
				    case 'link':
				        var link = E('a', T(post['link-text'])).attr({
    				        'href': post['link-url'],
    				        'target': '_blank'
    				    });
    				    var description = post['link-description'];
    					$(contentContainer).append(link).append(description);
				        break;
				        
				    case 'conversation':
				        var title = E('a', T(post['conversation-title'])).attr({
    				        'href': post['url'],
    				        'target': '_blank'
    				    });
    				    var conversation = post.conversation;
    				    var list = E('ul');
    				    $.each(conversation, function(i, item) {
    				        var name = E('strong', T(item.name));
    				        var phrase = T(item.phrase);
    				        convoList.append(E('li', name, phrase));
    				    }.bindScope(this));
    					$(contentContainer).addClass('tumblrConversation').append(title).append(list);
				        break;
				        
				    case 'regular':
				        var title = E('a', T(post['regular-title'])).attr({
    				        'href': post['url-with-slug'],
    				        'target': '_blank'
    				    });
    				    var body = post['regular-body'];
    				    $(contentContainer).addClass('tumblrRegular').append(title).append(body);
				        break;
				    
				    default:
				        break;
				}
				
				// create more link
				var moreLink = E('a', 'launch', T('More')).attr({
				    'href': post.url,
				    'target': '_blank'
				})
				var moreElement = E('div', moreLink);
				
				// append to DOM
				$(container).append(E('li', 'module', contentContainer, moreElement));
			}
		}
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
};
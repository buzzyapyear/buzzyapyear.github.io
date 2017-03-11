from cydotcom import flickr
from django.utils import simplejson
from cydotcom.tumblr import Api
from cydotcom import settings
import random, sys, string
from google.appengine.api import memcache

def getFlickrList(user_id='', tags='', numberToDisplay=6):
    """Check to see if flickr data is in memcache first""" 
    cachedset = memcache.get('flickr')
    
    
    
    """Get Flickr data, build markup, and cache a selection of the full dataset for randomizing"""
    if cachedset is None:
        numberToCache = numberToDisplay * 2
        dataset = flickr.photos_search(user_id=user_id, tags=tags, per_page=300)
        cachedset = []
        size = '248'
        for i in range(numberToCache):
            title = ''
            imgTag = ''
            flickrPageLink = ''
            mediumFlickrLink = ''
            largeFlickrLink = ''
            element = random.choice(dataset)
            dataset.remove(element)
            sizes = element.getSizes()
            for p in sizes:    
                if (p['label'] == 'Medium'):
                    if (p['width'] > p['height']):
                        definedDimension = 'height="%s"' % (size)
                        styleClass = 'flickrHoriz'
                    
                    else:
                        definedDimension = 'width="%s"' % (size)
                        styleClass = 'flickrVert'
                
                    flickrPageLink = p['url']
                    mediumFlickrLink = p['source']
                    title = element.title
                    imgTag = '<img src="%s" %s border="0" class="flickrPhoto %s"/>' % (mediumFlickrLink, definedDimension, styleClass)    


            photoObj = {
                'title': title,
                'imgTag': imgTag,
                'flickrPageLink': flickrPageLink,
                'mediumFlickrLink': mediumFlickrLink,
                # TODO[cyap] - I think the large size is too large... maybe remove this
                # 'largeFlickrLink': largeFlickrLink,
            }
        
            cachedset.append(photoObj)
            
        if not memcache.add('flickr', cachedset, settings.MEMCACHE_LENGTH):
            logging.error('Failed to add to memcache.')
            
            
    
    """Get a limited set of random selections from cached set"""
    photoList = []
    for i in range(numberToDisplay):
        element = random.choice(cachedset)
        cachedset.remove(element)
        photoList.append(element)

    return photoList
    
def getTumblrList(user_id='', tags='', numberToDisplay=6):
    """Check to see if flickr data is in memcache first"""
    posts = memcache.get('tumblr')
    
    if posts is not None:
        return posts
    
    else:
    
        """Gets data from Tumblr and builds markup"""
    
        api = Api(user_id)
        dataset = api.read(user_id, tags, numberToDisplay)
        postsData = dataset['posts']
        posts = []
    
        for item in postsData:
            if (item['type'] == 'photo'):
                photoLinkURL = item['url']
                imgTag = item['photo-url-400']
                caption = item['photo-caption']
                markup = '<div class="tumblrPost"><a href="%s" target="_blank"><img src="%s" border="0"/></a>%s</div><div><a href="%s" class="launch" target="_blank">More</a></div>' % (photoLinkURL, imgTag, caption, photoLinkURL)
                posts.append(markup)
            
            elif (item['type'] == 'link'):
                text = item['link-text']
                url = item['link-url']
                description = item['link-description']
                shortenedDescription = truncateString(description, 60)
                postURL = item['url-with-slug']
                markup = '<div class="tumblrPost"><a href="%s" target="_blank">%s</a><br/><p>%s</p></div><div><a href="%s" class="launch" target="_blank">More</a></div>' % (url, text, shortenedDescription, postURL)
                posts.append(markup)
        
            elif (item['type'] == 'quote'):
                text = item['quote-text']
                source = item['quote-source']
                shortenedSource = truncateString(source, 40)
                postURL = item['url-with-slug']
                markup = '<div class="tumblrPost tumblrQuote"><span class="quote">"%s"</span><br/><br/><span class="source">- %s</span></div><div><a href="%s" class="launch" target="_blank">More</a></div>' % (text, shortenedSource, postURL)
                posts.append(markup)
            
            elif (item['type'] == 'conversation'):
                title = item['conversation-title']
                url = item['url']
                conversationContent = item['conversation']
                conversation = ''
                for convoItem in conversationContent:
                    name = convoItem['name']
                    phrase = convoItem['phrase']
                    convoItemMarkup = '<li><strong>%s</strong>: %s</li>' % (name, phrase)
                    conversation += convoItemMarkup
                markup = '<div class="tumblrPost tumblrConversation"><a href="%s" target="_blank">%s</a><ul>%s</ul></div><div><a href="%s" class="launch" target="_blank">More</a></div>' % (url, title, conversation, url)    
                posts.append(markup)
                
            elif (item['type'] == 'regular'):
                title = item['regular-title']
                body = item['regular-body']
                truncatedBody = truncateString(body, 60)
                url = item['url-with-slug']
                markup = '<div class="tumblrPost tumblrRegular"><a href="%s" target="_blank">%s</a><p>%s</p></div><div><a href="%s" class="launch" target="_blank">More</a></div>' % (url, title, truncatedBody, url)
                posts.append(markup)

        if not memcache.add('tumblr', posts, settings.MEMCACHE_LENGTH):
            logging.error('Failed to add to memcache.')
        
        return posts

def truncateString(string, desiredLength):
    strArray = string.split(' ')
    wordCount = len(strArray)
    if (wordCount < desiredLength):
        return string
    else:        
        shortenedStrArray = []
        for i in range(desiredLength):
            shortenedStrArray.append(strArray[i])
        shortenedString = (' ').join(['%s' % (word) for word in shortenedStrArray])
        shortenedString += '...'
        return shortenedString
        
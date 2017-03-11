from cydotcom.settings import CY_MEDIA_URL
import re
import datetime


def getDate(request):
    now = datetime.datetime.now()
    day = now.day
    month = now.month
    year = now.year
    return {
        'day': day,
        'month': month,
        'year': year
    }


def imagesURL(request):
    return {'CY_MEDIA_URL': CY_MEDIA_URL}
    
def mobileSniff(request):
    phone = re.compile('iPhone|iPod|Android|BlackBerry', re.IGNORECASE)
    tablet = re.compile('iPad', re.IGNORECASE)
    
    if phone.search(request.META['HTTP_USER_AGENT']):
        isMobile = True
        mobileType = 'phone'
    
    elif tablet.search(request.META['HTTP_USER_AGENT']):
        isMobile = True
        mobileType = 'tablet'
        
    else:
        isMobile = False
        mobileType = False
    
    #isMobile = True
    #mobileType = 'tablet'
        
    return {'isMobile': isMobile, 'mobileType': mobileType}

def navSelect(request):

    # Get the first 'word' of the URL path:
    pageroot = request.path.split('/')[1]
    if len(request.path.split('/')) > 2:
        pagesecondary = request.path.split('/')[2]
    else:
        pagesecondary = ''

    default = ''
    
    # GLOBAL LEVEL
    # home
    if pageroot == '':
        active='home'
    elif pageroot == 'resume':
        active='resume'
    elif pageroot == 'work':
        active='work'
    elif pageroot == 'music':
        active='music'
    elif pageroot == 'contact':
        active='contact'
    
    else:
        active = default
    
    # SECONDARY LEVEL
    
    # browse
    if pagesecondary == 'featured':
        activesecondary='featured'
    elif pagesecondary == 'mostviewed':
        activesecondary='mostviewed'
        
    else:
        activesecondary = default

    return {'active': active, 'activesecondary': activesecondary}
from ragendja.settings_post import settings
from appenginepatcher import have_appserver, on_production_server

settings.add_app_media('combined.js',
    'cydotcom/js/sanity.js',
    'cydotcom/js/CYController.js',
    'cydotcom/js/thirdParty/shadowbox/shadowbox.js',
)

settings.add_app_media('combined.css',
    'cydotcom/css/reset.css',
    'cydotcom/css/style.css',
    'cydotcom/css/thirdParty/shadowbox/shadowbox.css',
)

settings.add_app_media('combinedMobile.css',
    'cydotcom/css/reset.css',
    'cydotcom/css/style-mobile.css',
    'cydotcom/css/thirdParty/shadowbox/shadowbox.css',
)

settings.add_app_media('combinedMobile.cy2.0.css',
    'cydotcom/css/reset.css',
    'cydotcom/css/thirdParty/jQueryMobile/jquery.mobile-1.0a2.min.css',
    'cydotcom/css/mobile/jquery.mobile-1.0a2.overwrite.css',
    'cydotcom/css/mobile/style-mobile.cy2.0.css',
)

settings.add_app_media('style-resume.css',
    'cydotcom/css/style-resume.css',
)

settings.add_app_media('style-print-resume.css',
    'cydotcom/css/style-print-resume.css',
)

CY_MEDIA_URL = 'http://media.chrisyap.com/'
#CY_MEDIA_URL = settings.MEDIA_URL
S3_MEDIA_URL = 'http://s3.media.chrisyap.com/'

if on_production_server:
    MEMCACHE_LENGTH = 86400
else:
    MEMCACHE_LENGTH = 5

BRANCH_MOBILE = True
# -*- coding: utf-8 -*-
from django.conf.urls.defaults import *

urlpatterns = patterns('cydotcom.views',
    (r'^$', 'home'),
    (r'^resume/$', 'resume'),
    (r'^work/$', 'work'),
    (r'^music/$', 'music'),
    (r'^contact/$', 'contact'),
    
    (r'^standalone/(?P<key>.+)/$', 'standalone'),
    
    (r'^mobileFlickrDialog/(?P<flickrFarm>.+)/(?P<flickrServer>.+)/(?P<flickrId>.+)/(?P<flickrSecret>.+)/$', 'mobileFlickrDialog'),

    # SAMPLE APP VIEWS
    # (r'^create_admin_user/$', 'create_admin_user'),
    # (r'^$', 'list_people'),
    # (r'^create/$', 'add_person'),
    # (r'^show/(?P<key>.+)$', 'show_person'),
    # (r'^edit/(?P<key>.+)$', 'edit_person'),
    # (r'^delete/(?P<key>.+)$', 'delete_person'),
    # (r'^download/(?P<key>.+)/(?P<name>.+)$', 'download_file'),
)

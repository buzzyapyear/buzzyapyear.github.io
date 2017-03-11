# -*- coding: utf-8 -*-
from django.core.urlresolvers import reverse
from django.contrib.auth.models import User
from django.http import HttpResponse, Http404
from django.views.generic.list_detail import object_list, object_detail
from django.views.generic.create_update import create_object, delete_object, \
    update_object
from google.appengine.ext import db
from mimetypes import guess_type
from ragendja.dbutils import get_object_or_404
from ragendja.template import render_to_response
from cydotcom import utils
from cydotcom import models
import re

def home(request):
    
    # # FLICKR
    # flickrID = '52033098@N00'
    # flickrTags = 'portfolioSite'
    # numberPhotosToDisplay = 6
    # photoList = utils.getFlickrList(flickrID, flickrTags, numberPhotosToDisplay)
    # 
    # # TUMBLR
    # tumblrID = 'buzzyapyear'
    # tumblrTags = 'portfolioSite'
    # numberPostsToDisplay = 6
    # postList = utils.getTumblrList(tumblrID, tumblrTags, numberPostsToDisplay)
    #
    #return render_to_response(request, 'home.html', {'photoList': photoList, 'postList': postList})
    
    return render_to_response(request, 'home.html')
    
def resume(request):
    return render_to_response(request, 'resume.html')

def work(request):
    
    portfolio = models.Portfolio.all().order('rank')
    
    return render_to_response(request, 'work.html', {'portfolio': portfolio})   

def music(request):
    
    categories = models.MusicCategory.all().order('rank')
    
    return render_to_response(request, 'music.html', {'categories': categories})
    
def contact(request):
    return render_to_response(request, 'contact.html')
    
def standalone(request, key):
    template_path = 'standalone/' + key + '.html'
    return render_to_response(request, template_path)
    
def mobileFlickrDialog(request, flickrFarm, flickrServer, flickrId, flickrSecret):
    imgUrl = 'http://farm' + flickrFarm + '.static.flickr.com/' + flickrServer + '/' + flickrId + '_' + flickrSecret + '.jpg';
    return render_to_response(request, 'mobileFlickrDialog.html', {'imgUrl': imgUrl})
    
# def create_admin_user(request):
#     user = User.get_by_key_name('admin')
#     if not user or user.username != 'admin' or not (user.is_active and
#             user.is_staff and user.is_superuser and
#             user.check_password('admin')):
#         user = User(key_name='admin', username='admin',
#             email='admin@localhost', first_name='Boss', last_name='Admin',
#             is_active=True, is_staff=True, is_superuser=True)
#         user.set_password('admin')
#         user.put()
#     return render_to_response(request, 'cydotcom/admin_created.html')

# -*- coding: utf-8 -*-
from django.db.models import permalink, signals
from google.appengine.ext import db
from ragendja.dbutils import cleanup_relations

class Portfolio(db.Model):
    title = db.StringProperty(required=True)
    role = db.StringProperty(required=True)
    tech = db.StringProperty(required=True)
    url = db.StringProperty()
    rank = db.FloatProperty()
    lightboxID = db.StringProperty()

class PortfolioScreenshot(db.Model):
    owner = db.ReferenceProperty(Portfolio, required=True, collection_name='screenshot_set')
    thumbFilename = db.StringProperty(required=True)
    largeFilename = db.StringProperty()
    title = db.StringProperty()
    main = db.BooleanProperty()
    
class MusicCategory(db.Model):
    title = db.StringProperty(required=True)
    markerImage = db.StringProperty(required=True)
    nickname = db.StringProperty()
    rank = db.FloatProperty()

class Music(db.Model):
    category = db.ReferenceProperty(MusicCategory, required=True, collection_name='music_set')
    title = db.StringProperty(required=True)
    url = db.StringProperty(required=True)
    thumbFilename = db.StringProperty(required=True)
    rank = db.FloatProperty()
    
    
#### legacy models from sample app
    
# class Person(db.Model):
#     """Basic user profile with personal details."""
#     first_name = db.StringProperty(required=True)
#     last_name = db.StringProperty(required=True)
# 
#     def __unicode__(self):
#         return '%s %s' % (self.first_name, self.last_name)
# 
#     @permalink
#     def get_absolute_url(self):
#         return ('myapp.views.show_person', (), {'key': self.key()})
# 
# signals.pre_delete.connect(cleanup_relations, sender=Person)
# 
# class File(db.Model):
#     owner = db.ReferenceProperty(Person, required=True, collection_name='file_set')
#     name = db.StringProperty(required=True)
#     file = db.BlobProperty(required=True)
# 
#     @permalink
#     def get_absolute_url(self):
#         return ('myapp.views.download_file', (), {'key': self.key(),
#                                                   'name': self.name})
# 
#     def __unicode__(self):
#         return u'File: %s' % self.name
# 
# class Contract(db.Model):
#     employer = db.ReferenceProperty(Person, required=True, collection_name='employee_contract_set')
#     employee = db.ReferenceProperty(Person, required=True, collection_name='employer_contract_set')
#     start_date = db.DateTimeProperty()
#     end_date = db.DateTimeProperty()
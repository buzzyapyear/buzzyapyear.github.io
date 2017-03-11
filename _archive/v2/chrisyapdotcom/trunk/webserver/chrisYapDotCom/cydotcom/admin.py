from django.contrib import admin
from cydotcom.models import Portfolio, PortfolioScreenshot, MusicCategory, Music

class ScreenshotInline(admin.TabularInline):
    model = PortfolioScreenshot

class PortfolioAdmin(admin.ModelAdmin):
    inlines = (ScreenshotInline,)
    list_display = ('title', 'role', 'tech', 'url', 'rank', 'lightboxID')

class MusicInline(admin.TabularInline):
    model = Music

class MusicCategoryAdmin(admin.ModelAdmin):
    inlines = (MusicInline,)
    list_display = ('title', 'markerImage', 'nickname')

admin.site.register(Portfolio, PortfolioAdmin)
admin.site.register(MusicCategory, MusicCategoryAdmin)
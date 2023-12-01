from django.contrib import admin
from .models import *

admin.site.register(Patient)
admin.site.register(Surgery)
admin.site.register(Video)
admin.site.register(CommentVideo)
admin.site.register(Image)
admin.site.register(CommentImage)


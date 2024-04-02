# admin.py

from django.contrib.admin import AdminSite
from django.contrib import admin
from django.views.decorators.clickjacking import xframe_options_exempt
# from .views import admin_csrf_failure_view
from django.utils.decorators import method_decorator

class CustomAdminSite(AdminSite):
    @xframe_options_exempt
    def index(self, request, extra_context=None):
        return super().index(request, extra_context)

    @xframe_options_exempt
    def app_index(self, request, app_label, extra_context=None):
        return super().app_index(request, app_label, extra_context)

# Instantiate your custom admin site
admin.site = CustomAdminSite()

# # Set your custom CSRF failure view for the admin site
# admin.site.csrf_failure_view = admin_csrf_failure_view
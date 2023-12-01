from django.urls import path
from . import views

urlpatterns = [
    path('get_company_list', views.get_company_list, name='get_company_list'),
    path('get_company_by_id/<int:company_id>/', views.get_company_by_id, name='get_company_by_id'),
]
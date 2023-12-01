from django.urls import path
from . import views

urlpatterns = [
    path('add-doctor/', views.add_doctor, name='add_doctor'),
    path('update-doctor/<int:doctor_id>/', views.edit_doctor, name='edit_doctor'),
    path('get-all-doctors/', views.get_all_doctors, name='get_all_doctors'),
]

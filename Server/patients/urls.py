from django.urls import path
from . import views

urlpatterns = [
    
    # Patient APIs
    path('add-patient/', views.add_patient, name='add_patient'),
    path('update-patient/<int:patient_id>/', views.edit_patient, name='edit_patient'),
    path('get-patients-list/', views.get_patient_list, name='get_patient_list'),
    path('get-patient/<int:patient_id>/', views.get_patient_by_id, name='get_patient_by_id'),

    # Surgery APIs
    path('add-surgery/<int:patient_id>/', views.add_surgery, name='add_surgery'),
    path('update-surgery/<int:surgery_id>/', views.edit_surgery, name='edit_surgery'),
    path('get-surgery-list-by-patient/<int:patient_id>/', views.get_surgery_list_by_patient_id, name='get_surgery_by_patient_id'),
    path('get-surgery-details/<int:surgery_id>/', views.get_surgery_by_surgery_id, name='get_surgery_by_id'),

    # Video APIs
    path('get-video-list-by-surgery/<int:surgery_id>/', views.get_surgery_video_list_by_surgery_id, name='get_video_by_surgery_id'),
    path('edit-surgery-video/<int:video_id>/', views.edit_surgery_video, name='edit_video'),
    path('add-surgery-video/<int:surgery_id>/', views.add_video, name='add_video'),
    path('get-comment-on-surgery-video/<int:video_id>/', views.get_comment_video_list_by_video_id, name='get_comment_on_video'),
    path('add-comment-on-surgery-video/<int:video_id>/', views.add_comment_video, name='add_comment_on_video'),
    path('edit-comment-on-surgery-video/<int:comment_id>/', views.edit_comment_video, name='edit_comment_on_video'),
    path('delete-comment-on-surgery-video/<int:comment_id>/', views.delete_comment_video, name='delete_comment_on_video'),

    # Image APIs
    path('get-image-list-by-surgery/<int:surgery_id>/', views.get_surgery_image_list_by_surgery_id, name='get_image_by_surgery_id'),
    path('edit-surgery-image/<int:image_id>/', views.edit_surgery_image, name='edit_image'),
    path('add-surgery-image/<int:surgery_id>/', views.add_image, name='add_image'),
    path('get-comment-on-surgery-image/<int:image_id>/', views.get_comment_image_list_by_image_id, name='get_comment_on_image'),
    path('add-comment-on-surgery-image/<int:image_id>/', views.add_comment_image, name='add_comment_on_image'),
    path('edit-comment-on-surgery-image/<int:comment_id>/', views.edit_comment_image, name='edit_comment_on_image'),
    path('delete-comment-on-surgery-image/<int:comment_id>/', views.delete_comment_image, name='delete_comment_on_image'),

]

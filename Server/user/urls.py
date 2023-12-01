from django.urls import path
# from django.views.decorators.csrf import csrf_exempt
from .views import *

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('signin/', signin.as_view(), name='signin'),
    path('signout/', signout, name='signout'),
    path('profile/', get_profile, name='profile'),
    path('profile/update/<id>/', update_profile, name='update_profile'),
    path('forgot_password/', forget_password, name='forgot_password'),
    path('reset_password/', reset_password, name='reset_password'),
    #csrf token
    # path('get-csrf-token/', get_csrf_token, name='get_token'),
]
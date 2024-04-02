from django.contrib import admin
from .models import User

def create_default_superuser(): 
    if not User.objects.filter(email='rakeshraushan1997@gmail.com').exists():
        # Create a superuser
        User.objects.create_superuser(
            id='admin',
            name='admin',
            phone_number='9876543210',
            email='admin@gmail.com',
            password='123456',
            )
        print('Superuser created successfully.')
    else:
        print('Superuser already exists.')
create_default_superuser()

admin.site.register(User)
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, id, email, name, phone_number, password=None):
        if not email:
            raise ValueError('The Email field must be set')
        user = self.model(
            id=id,
            email=self.normalize_email(email),
            name=name,
            phone_number=phone_number,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, id, email, name, phone_number, password):
        user = self.create_user(
            id=id,
            email=email,
            name=name,
            phone_number=phone_number,
            password=password,
        )
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser, PermissionsMixin):
    id = models.CharField(max_length=100, unique=True, primary_key=True)
    name = models.CharField(max_length=300)
    email = models.EmailField(max_length=254)
    phone_number = models.CharField(max_length=15)
    otp = models.CharField(max_length=6, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'id'
    EMAIL_FIELD = 'email'  # Add this line to specify the email field for authentication
    REQUIRED_FIELDS = ['email', 'name', 'phone_number']

    def __str__(self):
        return self.id

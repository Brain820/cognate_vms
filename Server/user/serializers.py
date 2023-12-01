from rest_framework import serializers
from .models import User

class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('name', 'email', 'id', 'phone_number', 'password')
    
class UserLoginSerializer(serializers.Serializer):
    """Your data serializer, define your fields here."""
    user_id_or_email=serializers.CharField()
    password = serializers.CharField()

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('name', 'email', 'id', 'phone_number')

class forgetPasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email',)

class resetPasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'otp', 'password')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'password')
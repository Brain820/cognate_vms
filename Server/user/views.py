from rest_framework import status
# from django.middleware import csrf
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
# from rest_framework_simplejwt.authentication import JWTAuthentication
# from django.views.decorators.csrf import csrf_exempt
# from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .serializers import *
from django.contrib.auth import authenticate#, login, logout
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import make_password
from .models import User
from django.http import JsonResponse
import random
from django.core.mail import send_mail
from drf_yasg.utils import swagger_auto_schema


# @swagger_auto_schema(method='get')
# @api_view(['GET'])
# # def get_csrf_token(request):
# #     token = csrf.get_token(request)
# #     return JsonResponse({'csrf_token': token})


@swagger_auto_schema(method='post', request_body=UserRegistrationSerializer)
@api_view(['POST'])
def signup(request):
    if request.method == 'POST':
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            password = make_password(serializer.validated_data['password'])
            serializer.validated_data['password'] = password
            user = serializer.save()
            login(request, user)
            return JsonResponse({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

'''
# @csrf_exempt
@swagger_auto_schema(method='post', request_body=UserLoginSerializer)
@api_view(['POST'])
def signin(request):
    id_or_email = request.data.get('id_or_email')
    password = request.data.get('password')
    
    # Check if the provided input is an email
    if '@' in id_or_email:
        user = User.objects.filter(email=id_or_email).first()
    else:
        # If not an email, assume it's a id
        user = User.objects.filter(id=id_or_email).first()

    if user is not None:
        user = authenticate(request, username=user.id, password=password)
        print(user)
        if user is not None:
            login(request, user)
            csrf_token = csrf.get_token(request)
            return Response({   'message': 'Login successful',"csrf_token":csrf_token}, status=status.HTTP_200_OK)

    return Response({'message': 'Login failed'}, status=status.HTTP_401_UNAUTHORIZED)'''

class signin(TokenObtainPairView):

    @swagger_auto_schema(request_body=UserLoginSerializer)
    def post(self, request, *args, **kwargs):
        id_or_email = request.data.get('user_id_or_email')
        password = request.data.get('password')
        
        # Check if the provided input is an email
        if '@' in id_or_email:
            user = User.objects.filter(email=id_or_email).first()
        else:
            # If not an email, assume it's a id
            user = User.objects.filter(id=id_or_email).first()

        if user is not None:
            user = authenticate(request, username=user.id, password=password)
            print(user)
            if user is not None:
                data={"id":user.id,"password":password}
                serializer = self.get_serializer(data=data)
                print(data)
                serializer.is_valid(raise_exception=True)
                return Response({   'message': 'Login successful',
                                "access_token":serializer.validated_data["access"],
                                "refresh_token":serializer.validated_data["refresh"],}, status=status.HTTP_200_OK)

        return Response({'message': 'Login failed'}, status=status.HTTP_401_UNAUTHORIZED)



# @csrf_exempt     
@api_view(['POST'])
def signout(request):
    if request.method == 'POST':
        logout(request)
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)

@swagger_auto_schema(method='get')
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    user = request.user
    serializer = UserProfileSerializer(user)
    return Response(serializer.data)

@swagger_auto_schema(method='put', request_body=UserProfileSerializer)
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request,id):
    try:
        user = User.objects.get(pk=id)
    except User.DoesNotExist:
        return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = UserProfileSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({'message': 'Profile updated successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(method='post', request_body=forgetPasswordSerializer)
@api_view(['POST'])
def forget_password(request):
    email = request.data.get('email')
    if not email:
        return Response({'message': 'Email is required'}, status=400)

    # Generate a random OTP (e.g., a 6-digit number)
    otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])

    # Send the OTP to the user's email address
    subject = 'Password Reset OTP'
    message = f'Your OTP for password reset is: {otp}'
    from_email = 'projectmail932@gmail.com'
    recipient_list = [email]

    # You can store the OTP in your database for validation
    user = User.objects.filter(email=email).first()
    print(user)
    if user:
        user.otp = otp
        user.save()
    

    send_mail(subject, message, from_email, recipient_list, fail_silently=False)

    return Response({'message': 'OTP sent successfully'})

@swagger_auto_schema(method='post', request_body=resetPasswordSerializer)
@api_view(['POST'])
def reset_password(request):
    email = request.data.get('email')
    otp = request.data.get('otp')
    new_password = request.data.get('password')

     # Verify OTP (You should store OTPs in your database for validation)
    user = User.objects.filter(email=email).first()
    print(user.otp==otp)
    print(user)
    if user.otp != otp:
        return Response({'message': 'Invalid OTP'}, status=400)

    # Reset the password
    user.password = make_password(new_password)
    user.save()

    return Response({'message': 'Password reset successfully'})
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Patient, Surgery
from .serializers import *
from drf_yasg.utils import swagger_auto_schema

@swagger_auto_schema(method='post', request_body=PatientSerializer)
@api_view(['POST'])
def add_patient(request):
    if request.method == 'POST':
        serializer = PatientSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(method='put', request_body=PatientSerializer)
@api_view(['PUT'])
def edit_patient(request, patient_id):
    try:
        patient = Patient.objects.get(pk=patient_id)
    except Patient.DoesNotExist:
        return Response({'message': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = PatientSerializer(patient, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(method='get')
@api_view(['GET'])
def get_patient_list(request):
    if request.method == 'GET':
        patients = Patient.objects.all()
        serializer = PatientSerializer(patients, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

@swagger_auto_schema(method='get')
@api_view(['GET'])
def get_patient_by_id(request, patient_id):
    try:
        patient = Patient.objects.get(pk=patient_id)
    except Patient.DoesNotExist:
        return Response({'message': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = PatientSerializer(patient)
        return Response(serializer.data, status=status.HTTP_200_OK)


#------surgery----------------------------------------------------------------------------------------------------------------

@swagger_auto_schema(method='post', request_body=SurgerySerializer)
@api_view(['POST'])
def add_surgery(request, patient_id):
    try:
        patient = Patient.objects.get(pk=patient_id)
    except Patient.DoesNotExist:
        return Response({'message': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'POST':
        serializer = SurgerySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(patient=patient)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(method='put', request_body=SurgerySerializer)
@api_view(['PUT'])
def edit_surgery(request, surgery_id):
    try:
        surgery = Surgery.objects.get(pk=surgery_id)
    except Surgery.DoesNotExist:
        return Response({'message': 'Surgery not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = SurgerySerializer(surgery, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(method='get')
@api_view(['GET'])
def get_surgery_list_by_patient_id(request, patient_id):
    try:
        patient = Patient.objects.get(pk=patient_id)
    except Patient.DoesNotExist:
        return Response({'message': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        surgeries = Surgery.objects.filter(patient=patient)
        serializer = SurgerySerializer(surgeries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

@swagger_auto_schema(method='get')
@api_view(['GET'])
def get_surgery_by_surgery_id(request, surgery_id):
    try:
        surgery = Surgery.objects.get(pk=surgery_id)
    except Surgery.DoesNotExist:
        return Response({'message': 'Surgery not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = SurgerySerializer(surgery)
        return Response(serializer.data, status=status.HTTP_200_OK)


#------surgery video----------------------------------------------------------------------------------------------------------------

@swagger_auto_schema(method='get')
@api_view(['GET'])
def get_surgery_video_list_by_surgery_id(request, surgery_id):
    try:
        surgery = Surgery.objects.get(pk=surgery_id)
    except Surgery.DoesNotExist:
        return Response({'message': 'Surgery not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        videos = Video.objects.filter(surgery=surgery_id)
        serializer = VideoSerializer(videos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
@swagger_auto_schema(method='put' ,request_body= VideoSerializer)
@api_view(['PUT'])
def edit_surgery_video(request, video_id):
    try:
        video = Video.objects.get(pk=video_id)
    except Video.DoesNotExist:
        return Response({'message': 'Video not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = VideoSerializer(video, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.error, status=status.HTTP_400_BAD_REQUEST)
    
@swagger_auto_schema(method='post', request_body=VideoSerializer)
@api_view(['POST'])
def add_video(request, surgery_id):
    try:
        surgery = Surgery.objects.get(pk=surgery_id)
    except Surgery.DoesNotExist:
        return Response({'message': 'Surgery not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'POST':
        serializer = VideoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(surgery=surgery)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# comment video -----------------------------------------------------------------------------------------------

@swagger_auto_schema(method='get')
@api_view(['GET'])
def get_comment_video_list_by_video_id(request, video_id):
    try:
        video = Video.objects.get(pk=video_id)
    except Video.DoesNotExist:
        return Response({'message': 'Video not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        comments = CommentVideo.objects.filter(video=video_id)
        serializer = CommentVideoSerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

@swagger_auto_schema(method='post', request_body=CommentVideoSerializer)
@api_view(['POST'])
def add_comment_video(request, video_id):
    try:
        video = Video.objects.get(pk=video_id)
    except Video.DoesNotExist:
        return Response({'message': 'Video not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'POST':
        serializer = CommentVideoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(video=video)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(method='put', request_body=CommentVideoSerializer)
@api_view(['PUT'])
def edit_comment_video(request, comment_id):
    try:
        comment = CommentVideo.objects.get(pk=comment_id)
    except CommentVideo.DoesNotExist:
        return Response({'message': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = CommentVideoSerializer(comment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.error, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(method='delete')
@api_view(['DELETE'])
def delete_comment_video(request, comment_id):
    try:
        comment = CommentVideo.objects.get(pk=comment_id)
    except CommentVideo.DoesNotExist:
        return Response({'message': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        comment.delete()
        return Response({'message': 'Comment deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    
#------surgery image----------------------------------------------------------------------------------------------------------------

@swagger_auto_schema(method='get')
@api_view(['GET'])
def get_surgery_image_list_by_surgery_id(request, surgery_id):
    try:
        surgery = Surgery.objects.get(pk=surgery_id)
    except Surgery.DoesNotExist:
        return Response({'message': 'Surgery not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        images = Image.objects.filter(surgery=surgery_id)
        serializer = ImageSerializer(images, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

@swagger_auto_schema(method='put' ,request_body= ImageSerializer)
@api_view(['PUT'])
def edit_surgery_image(request, image_id):
    try:
        image = Image.objects.get(pk=image_id)
    except Image.DoesNotExist:
        return Response({'message': 'Image not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = ImageSerializer(image, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.error, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(method='post', request_body=ImageSerializer)
@api_view(['POST'])
def add_image(request, surgery_id):
    try:
        surgery = Surgery.objects.get(pk=surgery_id)
    except Surgery.DoesNotExist:
        return Response({'message': 'Surgery not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'POST':
        serializer = ImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(surgery=surgery)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# comment image -----------------------------------------------------------------------------------------------

@swagger_auto_schema(method='get')
@api_view(['GET'])
def get_comment_image_list_by_image_id(request, image_id):
    try:
        image = Image.objects.get(pk=image_id)
    except Image.DoesNotExist:
        return Response({'message': 'Image not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        comments = CommentImage.objects.filter(image=image_id)
        serializer = CommentImageSerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

@swagger_auto_schema(method='post', request_body=CommentImageSerializer)
@api_view(['POST'])
def add_comment_image(request, image_id):
    try:
        image = Image.objects.get(pk=image_id)
    except Image.DoesNotExist:
        return Response({'message': 'Image not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'POST':
        serializer = CommentImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(image=image)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(method='put', request_body=CommentImageSerializer)
@api_view(['PUT'])
def edit_comment_image(request, comment_id):
    try:
        comment = CommentImage.objects.get(pk=comment_id)
    except CommentImage.DoesNotExist:
        return Response({'message': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = CommentImageSerializer(comment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.error, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(method='delete')
@api_view(['DELETE'])
def delete_comment_image(request, comment_id):
    try:
        comment = CommentImage.objects.get(pk=comment_id)
    except CommentImage.DoesNotExist:
        return Response({'message': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        comment.delete()
        return Response({'message': 'Comment deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    
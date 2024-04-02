from django.shortcuts import render
from .serializers import CompanySerializer
from .models import Company
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from drf_yasg.utils import swagger_auto_schema






@swagger_auto_schema(method='get')
@api_view(['GET'])
def get_company_list(request):
    if request.method == 'GET':
        company = Company.objects.all().order_by('id').first()
        serializer = CompanySerializer(company, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
   
@swagger_auto_schema(method='get')
@api_view(['GET'])
def get_company_by_id(request, company_id):
    if request.method == 'GET':
        try:
            company = Company.objects.get(id=company_id).first()
        except Company.DoesNotExist:
            return Response({'id':None,
                            'message': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = CompanySerializer(company,many =False)
        return Response(serializer.data, status=status.HTTP_200_OK)



@swagger_auto_schema(method='post', request_body=CompanySerializer)
@api_view(['POST'])
def add_company(request):
    if request.method == 'POST':
        serializer = CompanySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(method='put', request_body=CompanySerializer)
@api_view(['PUT'])
def edit_company(request, company_id):
    try:
        company = Company.objects.get(pk=company_id)
    except Company.DoesNotExist:
        return Response({'message': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = CompanySerializer(company, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
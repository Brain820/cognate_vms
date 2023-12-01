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
        company = Company.objects.all()
        serializer = CompanySerializer(company, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
   
@swagger_auto_schema(method='get')
@api_view(['GET'])
def get_company_by_id(request, company_id):
    if request.method == 'GET':
        company = Company.objects.get(id=company_id)
        serializer = CompanySerializer(company)
        return Response(serializer.data, status=status.HTTP_200_OK)
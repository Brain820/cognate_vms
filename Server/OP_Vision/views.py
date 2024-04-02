# from django.shortcuts import render

# def admin_csrf_failure_view(request, reason=''):
#     # You can customize the context or template as needed
#     return render(request, 'admin_csrf_failure.html', {'reason': reason})

from django.template import RequestContext
from rest_framework.decorators import api_view

@api_view(['GET'])
def csrf_views(request):
    # Render the CSRF token and pass it to the context
    csrf_token = RequestContext(request)['csrf_token']
    # Now `csrf_token` contains the CSRF token
    # Your view logic
    return Response({"csrf_token":csrf_token})
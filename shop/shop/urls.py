"""
URL configuration for shop project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from django.views.decorators.csrf import csrf_exempt

from django.conf import settings
from django.conf.urls.static import static

from django.urls import path

# def test_email(request):
#     subject = 'Test Email'
#     message = 'This is a test email.'
#     email_from = settings.EMAIL_HOST_USER
#     recipient_list = ['mrartem1927@gmail.com',]
#     send_mail(subject=subject, message=message, from_email=email_from, recipient_list=recipient_list, fail_silently=False)
#     return HttpResponse()

from graphene_file_upload.django import FileUploadGraphQLView



urlpatterns = [
    path('admin/', admin.site.urls),
    path("graphql", csrf_exempt(FileUploadGraphQLView.as_view(graphiql=True))),
    path("", csrf_exempt(FileUploadGraphQLView.as_view(graphiql=True))),

    #path('testmail/', test_email)
]


if settings.DEBUG:
        urlpatterns += static(settings.MEDIA_URL,
                              document_root=settings.MEDIA_ROOT)
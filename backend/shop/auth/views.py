
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User

from .user_serializer import UserSerializer


class UserDetailView(APIView):
    def get(self, request, id, *args, **kwargs):

        try:
            user = User.objects.get(id=id)

        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

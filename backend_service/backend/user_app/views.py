from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User
# Create your views here.
import json
from django.http import JsonResponse
from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken, TokenError
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import IsAuthenticated

# @api_view(['POST'])
# def login_view( request):
#     print(request.data)
#     username = request.data.get("username")
#     password = request.data.get("password")

#     try:
#         user = User.objects.get(username=username)
#     except User.DoesNotExist:
#         raise AuthenticationFailed("Account does  not exist")
#     if user is None:
#         raise AuthenticationFailed("User does not exist")
#     if not user.check_password(password):
#         raise AuthenticationFailed("Incorrect Password")
#     access_token = str(AccessToken.for_user(user))
#     refresh_token = str(RefreshToken.for_user(user))
#     return Response({
#         "access_token": access_token,
#         "refresh_token": refresh_token
#     })


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def home(request):
    if request:

        print('---------------')
        print(request.user.username,'heoo')
        print('---------------')
    print(request.META)

    resp = JsonResponse({"user": request.user.username})
    return resp


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    email = serializers.EmailField()
    firstname = serializers.CharField()
    lastname = serializers.CharField()

    def validate(self, data):
        if data['username']:
            if User.objects.filter(username=data['username']).exists():
                raise serializers.ValidationError("Username is already exists")
        if data['email']:
            if User.objects.filter(email=data['email']).exists():
                raise serializers.ValidationError('Email is already exists')
        return data

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['firstname'],
            last_name=validated_data['lastname']
        )
        user.set_password(validated_data['password'])
        user.save()
        return validated_data


@api_view(['POST', "GET"])
def signup(request):
    if request.data:
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return JsonResponse({"message": serializer.errors}, status=404)
        print(request.data)
        serializer.save()
        return JsonResponse({'message': 'success'}, status=201)
    return HttpResponse('')

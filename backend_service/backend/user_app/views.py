from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User
# Create your views here.
from io import BytesIO
from django.http import JsonResponse
from rest_framework import serializers, status,viewsets
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import MyModelSerializer, UserSerializer, UserUpdateSerializer
from .models import UserImage
from rest_framework_simplejwt.tokens import  RefreshToken, TokenError, AccessToken


from rest_framework import permissions
from rest_framework.parsers import MultiPartParser, FormParser
class MyModelViewSet(viewsets.ModelViewSet):
    queryset = UserImage.objects.all()
    serializer_class = MyModelSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def get_user(request):
    user = request.user
    user = UserSerializer(user)
    data=user.data
    if UserImage.objects.filter(creator=request.user).exists():
        imageUrl=UserImage.objects.filter(creator=request.user).first().image.url
        data['image']='http://127.0.0.1:8000/'+imageUrl
    data['is_admin']=request.user.is_superuser
    return Response(data, status=status.HTTP_200_OK)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def update_user(request):
    user = request.user
    user=User.objects.get(pk=user.pk)
    serializer = UserUpdateSerializer(instance=user,data=request.data)
    if serializer.is_valid():
        user=serializer.save()
        data=serializer.data
        if UserImage.objects.filter(creator=user).exists():
            UserImage.objects.filter(creator=user).delete()
        if request.data.get('image',None):
            if UserImage.objects.filter(creator=user).exists():
                UserImage.objects.filter(creator=user).delete()
            image=UserImage.objects.create(creator=user,image=request.data.get('image'))
        
            image.save() 
            data['image']=image.image.url
        else:print(request.data)
        
       
        return Response(data, status=status.HTTP_200_OK)
    else:
        return Response({"message": serializer.errors}, status=401)


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    email = serializers.EmailField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()

    def validate(self, data):
        if data['username']:
            if User.objects.filter(username=data['username']).exists():
                raise serializers.ValidationError({"username":"Username is already exists"})
        if data['email']:
            if User.objects.filter(email=data['email']).exists():
                raise serializers.ValidationError({"email":'Email is already exists'})
        return data

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        user.set_password(validated_data['password'])
        user.save()
        return validated_data


@api_view(['POST', "GET"])
def signup(request):
    if request.data:
        print(request.data)
        print(request.data)
        print(request.data)
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return JsonResponse({"message": serializer.errors}, status=404)
        print(request.data)
        serializer.save()
        return JsonResponse({'message': 'success'}, status=201)
    return HttpResponse('')

@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    
        refresh_token = request.data['refresh_token']
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        return Response("Logout Successful", status=status.HTTP_200_OK)
    
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def change_pass(request):
    user = request.user
    user=User.objects.get(pk=user.pk)
    if request.data:
        print(request.data)
        print(request.data)
        print(request.data)
        if user.check_password(request.data['old_password']):
            if len(request.data['password'])<6:
                return Response({'message':'password need atleast 6'},status=401)
            user.set_password(request.data['password'])
            user.save()
            
            return Response({"message":'success'})
        else:
            return Response({'message':'wrong old password'},status=401)
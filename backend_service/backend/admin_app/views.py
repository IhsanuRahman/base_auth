from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from user_app.serializers import MyModelSerializer, UserSerializer
from user_app.models import User, UserImage
from rest_framework_simplejwt.tokens import  RefreshToken, TokenError, AccessToken
from rest_framework.exceptions import AuthenticationFailed
from .serializer import RegisterSerializer, UserSerializer as ClientSerializer,UserUpdateSerializer
from django.db.models import Q

@api_view(['GET','POST'])
def admin_login_view( request):
    print(request.data)
    username = request.data.get("username")
    password = request.data.get("password")

    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        raise AuthenticationFailed("Account does  not exist")
    if user is None or  not user.is_superuser:
        raise AuthenticationFailed("User does not exist")
    if not user.check_password(password):
        raise AuthenticationFailed("Incorrect Password")
    access_token = str(AccessToken.for_user(user))
    refresh_token = str(RefreshToken.for_user(user))
    return Response({
        "access": access_token,
        "refresh": refresh_token
    })

@api_view(['GET','POST'])
def get_users(request):
    users=User.objects.all()
    search=''
    print(request.data.get('search',""))
    if request.data:
        search=request.data.get('search',"")
        if search !='':
            users=users.filter(Q(username__icontains=search)|Q(email__icontains=search)|Q(first_name__icontains=search)|Q(last_name__icontains=search))
    datas=[]
    for user in users:
        data=ClientSerializer(user).data
        if UserImage.objects.filter(creator=user).exists():
            data['image']=UserImage.objects.get(creator=user).image.url
        datas.append(data)
    return Response({"users":datas})

@api_view(['GET','POST'])
def get_user_data(request):
    user=User.objects.filter(id=request.data['id']).first()
    if user:
        data=ClientSerializer(user).data
        if UserImage.objects.filter(creator=user).exists():
            data['image']='http://127.0.0.1:8000'+UserImage.objects.get(creator=user).image.url
        
    return Response({"userData":data})

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def update_user(request):
    user=User.objects.get(id=request.data.get('id'))
    serializer = UserUpdateSerializer(instance=user,data=request.data)
    if serializer.is_valid():
        user=serializer.save()
        data=serializer.data
        if request.data.get('image'):
            if UserImage.objects.filter(creator=user).exists():
                UserImage.objects.filter(creator=user).delete()
            image=UserImage.objects.create(creator=user,image=request.data.get('image'))
            image.save()
            print(image.image.url,'got the image')
            data['image']='http://127.0.0.1:8000'+image.image.url
        else:print(user)
        return Response(data, status=200)
    else:
        return Response({"message": serializer.errors}, status=401)
    
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def create_user(request):
    print(request.data)
    print(request.data)
    print(request.data)
    if request.data:
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"message": serializer.errors}, status=404)
        print(request.data)
        user=serializer.save()
        if request.data.get('image',None):
            if UserImage.objects.filter(creator=user).exists():
                UserImage.objects.filter(creator=user).delete()
            image=UserImage.objects.create(creator=user,image=request.data.get('image'))
        
            image.save()
        else:print(request.data)
        print(image.image.url)
        data=serializer.data
        
        data['image']=image.image.url
        return Response({'message': 'success'}, status=201)
    else:
        return Response({"message": serializer.errors}, status=401)
    
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def delete_user(request):
    if request.data and request.user.is_superuser:
        id=request.data.get('id')
        try:
            user=User.objects.get(id=id)
            user.delete()
        except :
            return Response({'message':'user not found'},status=401)
        return Response({'message':'success'},status=200)



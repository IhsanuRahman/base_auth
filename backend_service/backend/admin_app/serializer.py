from rest_framework import serializers
from django.contrib.auth import get_user_model
User = get_user_model()
class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ('username','first_name', 'last_name', 'email','is_superuser','id')

class UserUpdateSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ('username','first_name', 'last_name', 'email','is_superuser')
  def validate(self, data):
       
        print(self.instance.email)
        if data['username']:
            if User.objects.exclude(pk=self.instance.pk).filter(username=data['username']).exists():
                raise serializers.ValidationError({'username':"Username is already exists"})
        if data['email']:
            if User.objects.exclude(pk=self.instance.pk).filter(email=data['email']).exists():
                raise serializers.ValidationError({'email':'Email is already exists'})
        return data
  def create(self, validated_data):
    user=User.objects.get(pk=self.instance.pk)
    if user:
       print(validated_data)
       user.username=validated_data['username']
       user.firstname=validated_data['firstname']
       user.lastname=validated_data['lastname']
       user.email=validated_data['email']
       user.save()

class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    email = serializers.EmailField()
    firstname = serializers.CharField()
    lastname = serializers.CharField()
    is_superuser=serializers.BooleanField()
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
            last_name=validated_data['lastname'],
            is_superuser=validated_data['is_superuser']
        )
        user.set_password(validated_data['password'])
        user.save()
        return validated_data
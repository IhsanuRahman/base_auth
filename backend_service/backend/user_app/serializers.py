from .models import UserImage
from rest_framework import serializers
from django.contrib.auth import get_user_model
User = get_user_model()
class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ('username','first_name', 'last_name', 'email',)
  
class UserUpdateSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ('username','first_name', 'last_name', 'email',)
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


class MyModelSerializer(serializers.ModelSerializer):

    creator = serializers.ReadOnlyField(source='creator.username')
    image_url = serializers.ImageField(required=False)

    class Meta:
        model = UserImage
        fields = ['creator','image_url']
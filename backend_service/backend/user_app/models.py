from django.db import models

from django.contrib.auth import get_user_model
User = get_user_model()
# Create your models here.
def upload_to(instance, filename):
    return 'images/{filename}'.format(filename=filename)



class UserImage(models.Model):
    creator = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="image")
    image = models.ImageField(upload_to=upload_to, blank=True, null=True) 
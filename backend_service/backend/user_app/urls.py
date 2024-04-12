from . import views
from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt import views as jwt_views
from rest_framework.authtoken import views as auth_views


urlpatterns = [
    path('user', views.get_user),
    path('user/update', views.update_user),
    path('login', jwt_views.TokenObtainPairView.as_view()),
    path('logout', views.logout),
    path('change-password', views.change_pass),
    path('token',jwt_views.TokenObtainPairView.as_view(),name='token_obtain_pair'),
    path('api-token-auth/', auth_views.obtain_auth_token),
    path('token/refresh', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify', jwt_views.TokenVerifyView.as_view()),
    path('signup', views.signup)
]

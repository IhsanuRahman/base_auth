
from django.urls import include,path
from . import views
urlpatterns=[
    path('login',views.admin_login_view),
    path('users',views.get_users),
    path('user',views.get_user_data),
    path('user/update',views.update_user),
    path('user/create',views.create_user),
    path('user/delete',views.delete_user),
]
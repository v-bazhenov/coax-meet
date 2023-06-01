from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

from authentication.views import TokenObtainPairView, CustomUserViewSet

users = DefaultRouter()
users.register("users", CustomUserViewSet, basename='users')

urlpatterns = [
    path('', include(users.urls)),
    path("login/", TokenObtainPairView.as_view(), name="login"),
    path("refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("verify/", TokenVerifyView.as_view(), name="verify")
]

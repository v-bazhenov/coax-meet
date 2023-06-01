from django_filters.rest_framework import DjangoFilterBackend
from djoser.views import UserViewSet
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView as OriginalObtainPairView

from authentication.filters import UserFilter
from authentication.models import User
from authentication.serializers import TokenObtainPairSerializer, CustomUserListSerializer


class TokenObtainPairView(OriginalObtainPairView):
    serializer_class = TokenObtainPairSerializer


class CustomUserViewSet(UserViewSet):
    filterset_class = UserFilter
    filter_backends = (DjangoFilterBackend,)
    serializer_class = CustomUserListSerializer

    def get_queryset(self):
        user = self.request.user
        return User.objects.exclude(id=user.id)

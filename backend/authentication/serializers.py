from django.contrib.auth import authenticate
from djoser.conf import settings
from djoser.serializers import TokenCreateSerializer, UserCreateSerializer as BaseUserRegistrationSerializer, \
    UserSerializer
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer as OriginalObtainPairSerializer,
)

from authentication.models import User


class TokenObtainPairSerializer(OriginalObtainPairSerializer):
    """
    Custom Token pair generator, Added full_name field to tokens to access it on a frontend
    """

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["full_name"] = user.first_name + " " + user.last_name
        return token


class UserRegistrationSerializer(BaseUserRegistrationSerializer):
    class Meta(BaseUserRegistrationSerializer.Meta):
        fields = ('email', 'password', 'first_name', 'last_name')
        read_only_fields = ('id',)


class CustomTokenCreateSerializer(TokenCreateSerializer):

    def validate(self, attrs):
        password = attrs.get("password")
        params = {settings.LOGIN_FIELD: attrs.get(settings.LOGIN_FIELD)}
        self.user = authenticate(
            request=self.context.get("request"), **params, password=password
        )
        if not self.user:
            self.user = User.objects.filter(**params).first()
            if self.user and not self.user.check_password(password):
                self.fail("invalid_credentials")
        if self.user:
            return attrs
        self.fail("invalid_credentials")


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # The default result (access/refresh tokens)
        data = super(CustomTokenObtainPairSerializer, self).validate(attrs)
        # Custom data you want to include
        data.update({'user': self.user.username, 'user_id': self.user.id})
        # and everything else you want to send in the response
        return data


class CustomUserListSerializer(UserSerializer):
    class Meta(BaseUserRegistrationSerializer.Meta):
        fields = ('id', 'email', 'full_name')
        read_only_fields = ('id', 'email', 'full_name')

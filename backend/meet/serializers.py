from drf_extra_fields.relations import PresentablePrimaryKeyRelatedField
from rest_framework import serializers

from authentication.models import User
from meet.models import Room
from meet.service import InvitationService


class MembersSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "full_name"]


class RoomSerializer(serializers.ModelSerializer):
    members = PresentablePrimaryKeyRelatedField(
        presentation_serializer=MembersSerializer,
        queryset=User.objects.all(),
        many=True
    )
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), default=serializers.CurrentUserDefault())
    created_at = serializers.DateTimeField(read_only=True, format="%H:%M %Y-%m-%d")
    time = serializers.TimeField(format="%H:%M")

    class Meta:
        model = Room
        fields = ["id", "title", "description", "created_at", 'weekdays', "time", "members", "user", "remind_before"]

    def create(self, validated_data):
        instance = super().create(validated_data)
        instance.members.add(instance.user)
        InvitationService(instance).send_invite()
        return instance

    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        InvitationService(instance).alter_invitation()
        return instance

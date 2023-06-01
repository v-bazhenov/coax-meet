from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets

from authentication.permissions import IsOwnerOrReadOnly
from meet.filters import RoomFilter
from meet.models import Room
from meet.serializers import RoomSerializer


class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.order_by("-created_at")
    serializer_class = RoomSerializer
    filterset_class = RoomFilter
    filter_backends = (DjangoFilterBackend,)
    permission_classes = [IsOwnerOrReadOnly]

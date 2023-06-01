from django.urls import re_path
from rest_framework import routers

from meet import consumers
from meet.views import RoomViewSet

# Rooms url
router = routers.DefaultRouter()
router.register("rooms", RoomViewSet, basename="rooms")
urlpatterns = router.urls

websocket_urlpatterns = [
    re_path(r"video/(?P<room_name>\w+)/$", consumers.VideoConsumer.as_asgi()),
]

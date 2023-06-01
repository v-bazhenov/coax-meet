from datetime import datetime

from mixer.backend.django import mixer
from channels.testing import WebsocketCommunicator
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from authentication.models import User
from meet.consumers import VideoConsumer
from meet.models import Room


class RoomAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email="testuser@test.com", password="testpass")
        self.client.force_authenticate(user=self.user)
        self.schedule = mixer.blend("django_celery_beat.CrontabSchedule", minute=0, hour=1)
        self.periodic_task = mixer.blend("django_celery_beat.PeriodicTask", crontab=self.schedule)

    def test_create_room(self):
        url = reverse("meet:rooms-list")
        data = {
            "user": self.user.id,
            "title": "asdf",
            "description": "asdf",
            "weekdays": [3, 4],
            "time": "10:00",
            "remind_before": "10",
            "members": [],
        }

        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Room.objects.count(), 1)
        self.assertEqual(Room.objects.get().user, self.user)
        self.assertEqual(str(Room.objects.first()), Room.objects.first().title)

    def test_edit_room(self):
        room = Room.objects.create(
            user=self.user,
            title="Initial Title",
            description="Initial Description",
            weekdays=[3, 4],
            time="10:00",
            remind_before="10",
            periodic_task=self.periodic_task,
        )
        url = reverse("meet:rooms-detail", args=[room.id])
        data = {
            "title": "Updated Title",
            "description": "Updated Description",
            "weekdays": [1, 2],
            "time": "15:00",
            "remind_before": "5",
        }

        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        room.refresh_from_db()
        self.assertEqual(room.title, "Updated Title")
        self.assertEqual(room.description, "Updated Description")
        self.assertEqual(room.weekdays, [1, 2])
        self.assertEqual(room.time, datetime.strptime("15:00", "%H:%M").time())
        self.assertEqual(room.remind_before, 5)

    def test_delete_room(self):
        room = Room.objects.create(
            user=self.user,
            title="Test Title",
            description="Test Description",
            weekdays=[3, 4],
            time="10:00",
            remind_before="10",
        )
        url = reverse("meet:rooms-detail", args=[room.id])

        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Room.objects.count(), 0)


class VideoConsumerTest(TestCase):
    async def test_video_consumer(self):

        communicator = WebsocketCommunicator(VideoConsumer.as_asgi(), "/video/test-room/")
        communicator.scope["url_route"] = {"kwargs": {"room_name": "test-room"}}

        connected = await communicator.connect()
        self.assertTrue(connected)

        try:
            # Test sending and receiving messages
            message = {
                "type": "new_user_joined",
                "from": "test_user",
                "token": "test_token",
                "user_full_name": "Test User",
            }
            await communicator.send_json_to(message)
            response = await communicator.receive_json_from()

            expected_response = {
                "type": "new_user_joined",
                "from": "test_user",
                "users_connected": [
                    {"user_id": "test_user", "user_full_name": "Test User"}
                ],
            }
            self.assertEqual(response, expected_response)
        finally:
            # Test disconnecting
            await communicator.disconnect()

    async def test_new_user_joined(self):
        communicator = WebsocketCommunicator(VideoConsumer.as_asgi(), "/video/test-room/")
        communicator.scope["url_route"] = {"kwargs": {"room_name": "test-room"}}
        connected, _ = await communicator.connect()
        self.assertTrue(connected)

        # Simulate a new user joining the room
        await communicator.send_json_to(
            {"type": "new_user_joined", "from": "user1", "token": "token", "user_full_name": "John Doe"})
        response = await communicator.receive_json_from()
        self.assertEqual(response["type"], "new_user_joined")
        self.assertEqual(response["from"], "user1")
        self.assertEqual(response["users_connected"], [{"user_id": "user1", "user_full_name": "John Doe"}])

        # Disconnect from the room
        await communicator.disconnect()

    async def test_sending_offer(self):
        communicator1 = WebsocketCommunicator(VideoConsumer.as_asgi(), "/video/test-room/")
        communicator1.scope["url_route"] = {"kwargs": {"room_name": "test-room"}}
        connected1, _ = await communicator1.connect()
        self.assertTrue(connected1)

        communicator2 = WebsocketCommunicator(VideoConsumer.as_asgi(), "/video/test-room/")
        communicator2.scope["url_route"] = {"kwargs": {"room_name": "test-room"}}
        connected2, _ = await communicator2.connect()
        self.assertTrue(connected2)

        # Simulate user1 sending an offer to user2
        await communicator1.send_json_to({"type": "sending_offer", "from": "user1", "to": "user2", "offer": "offer_data"})
        response = await communicator2.receive_json_from()
        self.assertEqual(response["type"], "sending_offer")
        self.assertEqual(response["from"], "user1")
        self.assertEqual(response["to"], "user2")
        self.assertEqual(response["offer"], "offer_data")

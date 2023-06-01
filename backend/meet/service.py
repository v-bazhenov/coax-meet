import calendar
import json
from datetime import datetime, timedelta

from django.conf import settings
from django.utils.translation import gettext as _
from django_celery_beat.models import CrontabSchedule, PeriodicTask

from meet.models import Room
from meet.tasks import send_text_mail


class InvitationService:

    def __init__(self, room: Room):
        self.room = room
        self.hour, self.minute = str(room.time.hour), str(room.time.minute)
        self.weekdays_string = ",".join([str(i) for i in room.weekdays])
        self.remind_hour, self.remind_minute = self.subtract_minutes_from_time(self.room.time, self.room.remind_before)

    @staticmethod
    def get_day_names(weekdays: list) -> list:
        """ Converts list of weekdays to list of day names """
        return [calendar.day_name[i - 1] for i in weekdays]

    @staticmethod
    def subtract_minutes_from_time(my_time, minutes_to_subtract):
        # Convert to datetime.datetime object with a specific date
        current_datetime = datetime.combine(datetime.today(), my_time)

        # Subtract minutes using timedelta
        result_datetime = current_datetime - timedelta(minutes=minutes_to_subtract)

        # Extract the time component
        result_time = result_datetime.time()
        hour, minute = str(result_time.hour), str(result_time.minute)

        return hour, minute

    def send_invite(self) -> None:
        send_text_mail.delay(
            _(f'Invitation for {self.room.title}'),
            _(f'You have been invited to join {self.room.title} at {self.hour}:{self.minute.zfill(2)} on '
              f'{self.get_day_names(self.room.weekdays)}'),
            settings.EMAIL_HOST_USER,
            self.room.members_emails,
        )

        # Set up the reminder

        schedule = CrontabSchedule.objects.create(
            minute=self.remind_minute,
            hour=self.remind_hour,
            day_of_week=self.weekdays_string
        )
        periodic_task = PeriodicTask.objects.create(
            crontab=schedule,
            name=_(f"Reminder for Meeting {self.room.title}"),
            task="meet.tasks.send_text_mail",
            args=json.dumps([
                _(f"Reminder for Room {self.room.title}"),
                _(f"You have a meeting scheduled for today at {self.hour}:{self.minute.zfill(2)}"),
                settings.EMAIL_HOST_USER,
                self.room.members_emails,
            ])
        )
        self.room.periodic_task = periodic_task
        self.room.save()

    def alter_invitation(self) -> None:
        schedule = self.room.periodic_task.crontab
        schedule.minute = self.remind_minute
        schedule.hour = self.remind_hour
        schedule.day_of_week = self.weekdays_string
        schedule.save()
        self.room.periodic_task.save()
        send_text_mail.delay(
            _(f'Updated invitation for {self.room.title}'),
            _(f'Your invitation has been updated. New time is {self.hour}:{self.minute.zfill(2)} on '
              f'{self.get_day_names(self.room.weekdays)}'),
            settings.EMAIL_HOST_USER,
            self.room.members_emails,
        )

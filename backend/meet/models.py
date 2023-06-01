from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.utils.translation import gettext_lazy as _

from authentication.models import User
from django_celery_beat.models import PeriodicTask


class Room(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name=_('user'))
    title = models.CharField(max_length=200, unique=True, verbose_name=_('title'))
    description = models.TextField(default="", verbose_name=_('description'))

    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('created_at'))
    members = models.ManyToManyField(User, related_name="room_members", blank=True, verbose_name=_('members'))

    weekdays = ArrayField(models.IntegerField(), null=True, verbose_name=_('weekdays'))
    time = models.TimeField(null=True, verbose_name=_('time'))
    periodic_task = models.OneToOneField(PeriodicTask, on_delete=models.CASCADE, null=True, related_name='room',
                                         verbose_name=_('periodic_task'))

    remind_before = models.PositiveSmallIntegerField(default=10, verbose_name=_('remind_before'))

    class Meta:
        db_table = 'meet_room'
        verbose_name = _('room')
        verbose_name_plural = _('rooms')

    def __str__(self):
        return self.title

    @property
    def members_emails(self):
        return [member.email for member in self.members.all()]

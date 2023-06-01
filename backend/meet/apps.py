from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class MeetConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'meet'
    verbose_name = _('meet')

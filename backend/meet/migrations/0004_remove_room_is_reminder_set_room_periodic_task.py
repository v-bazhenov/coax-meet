# Generated by Django 4.2.1 on 2023-05-18 13:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('django_celery_beat', '0018_improve_crontab_helptext'),
        ('meet', '0003_room_is_reminder_set'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='room',
            name='is_reminder_set',
        ),
        migrations.AddField(
            model_name='room',
            name='periodic_task',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='django_celery_beat.periodictask'),
        ),
    ]

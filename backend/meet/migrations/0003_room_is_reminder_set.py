# Generated by Django 4.2.1 on 2023-05-18 12:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('meet', '0002_room_time_room_weekdays'),
    ]

    operations = [
        migrations.AddField(
            model_name='room',
            name='is_reminder_set',
            field=models.BooleanField(default=False),
        ),
    ]

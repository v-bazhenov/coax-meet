# Generated by Django 4.2.1 on 2023-05-18 11:39

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('meet', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='room',
            name='time',
            field=models.TimeField(null=True),
        ),
        migrations.AddField(
            model_name='room',
            name='weekdays',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), null=True, size=None),
        ),
    ]

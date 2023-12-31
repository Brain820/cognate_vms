# Generated by Django 4.2.5 on 2023-11-18 14:18

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('patients', '0004_alter_image_image_file'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='image',
            name='last_user_view',
        ),
        migrations.RemoveField(
            model_name='video',
            name='last_user_view',
        ),
        migrations.AlterField(
            model_name='image',
            name='created_date',
            field=models.DateTimeField(blank=True, default=datetime.datetime.now),
        ),
        migrations.AlterField(
            model_name='video',
            name='created_date',
            field=models.DateTimeField(blank=True, default=datetime.datetime.now),
        ),
    ]

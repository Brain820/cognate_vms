# Generated by Django 5.0 on 2024-03-07 10:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('company_setting', '0007_auto_20240229_1736'),
    ]

    operations = [
        migrations.AddField(
            model_name='company',
            name='camera_framerate',
            field=models.IntegerField(default=15),
        ),
        migrations.AddField(
            model_name='company',
            name='camera_wdr_status',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='company',
            name='camera_zoom_speed',
            field=models.IntegerField(default=5),
        ),
    ]

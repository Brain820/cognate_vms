# Generated by Django 5.0 on 2024-03-09 17:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('company_setting', '0008_company_camera_framerate_company_camera_wdr_status_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='company',
            name='camera_wdr_status',
            field=models.CharField(choices=[('off', 'off'), ('on', 'on')], default='off', max_length=255),
        ),
    ]
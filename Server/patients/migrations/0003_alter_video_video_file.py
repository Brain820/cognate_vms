# Generated by Django 4.2.5 on 2023-11-13 16:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('patients', '0002_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='video',
            name='video_file',
            field=models.CharField(max_length=200),
        ),
    ]

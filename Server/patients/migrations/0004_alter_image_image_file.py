# Generated by Django 4.2.5 on 2023-11-13 20:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('patients', '0003_alter_video_video_file'),
    ]

    operations = [
        migrations.AlterField(
            model_name='image',
            name='image_file',
            field=models.CharField(max_length=200),
        ),
    ]

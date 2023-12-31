# Generated by Django 4.2.5 on 2023-11-13 20:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('company_setting', '0003_company_storage_path'),
    ]

    operations = [
        migrations.AlterField(
            model_name='company',
            name='logo',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='company',
            name='video_streaming',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='company',
            name='watermarked_logo',
            field=models.CharField(default='', max_length=255),
        ),
    ]

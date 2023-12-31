# Generated by Django 4.1 on 2023-10-23 20:44

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Hospital',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('logo', models.URLField()),
                ('company_name', models.CharField(max_length=255)),
                ('software_name', models.CharField(max_length=255)),
                ('company_address', models.TextField()),
                ('state', models.CharField(max_length=100)),
                ('district', models.CharField(max_length=100)),
                ('pin', models.CharField(max_length=10)),
                ('company_email', models.EmailField(max_length=254)),
                ('company_mobile_no', models.CharField(max_length=15)),
                ('video_streaming', models.URLField()),
                ('about_hospital', models.TextField()),
                ('watermarked_logo', models.URLField()),
            ],
        ),
    ]

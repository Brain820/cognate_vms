# Generated by Django 4.2.5 on 2023-10-24 10:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('company_setting', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Hospital',
            new_name='Company',
        ),
    ]

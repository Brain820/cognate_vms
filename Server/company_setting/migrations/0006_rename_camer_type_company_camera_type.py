# Generated by Django 3.2.7 on 2024-02-29 17:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('company_setting', '0005_auto_20240229_1710'),
    ]

    operations = [
        migrations.RenameField(
            model_name='company',
            old_name='camer_type',
            new_name='camera_type',
        ),
    ]
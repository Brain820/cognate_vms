# Generated by Django 4.2.5 on 2023-11-13 20:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('company_setting', '0002_rename_hospital_company'),
    ]

    operations = [
        migrations.AddField(
            model_name='company',
            name='storage_path',
            field=models.CharField(default='', max_length=255),
        ),
    ]

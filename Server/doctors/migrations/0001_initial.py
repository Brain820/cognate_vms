# Generated by Django 4.2.5 on 2023-11-07 14:54

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Doctor',
            fields=[
                ('doctor_name', models.CharField(max_length=100)),
                ('profile_pic', models.ImageField(blank=True, null=True, upload_to='static/doctors')),
                ('specialist', models.CharField(max_length=100)),
                ('qualification', models.TextField()),
                ('doctor_id', models.AutoField(primary_key=True, serialize=False)),
            ],
        ),
    ]

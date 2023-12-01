# Generated by Django 4.2.5 on 2023-11-07 14:54

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CommentImage',
            fields=[
                ('comment_id', models.AutoField(primary_key=True, serialize=False)),
                ('date_time_comment', models.DateTimeField(auto_now_add=True)),
                ('comment_text', models.TextField()),
                ('headline', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='CommentVideo',
            fields=[
                ('comment_id', models.AutoField(primary_key=True, serialize=False)),
                ('date_time_comment', models.DateTimeField(auto_now_add=True)),
                ('comment_text', models.TextField()),
                ('headline', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Image',
            fields=[
                ('image_id', models.AutoField(primary_key=True, serialize=False)),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('image_file', models.URLField()),
                ('last_view_datetime', models.DateTimeField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Patient',
            fields=[
                ('patient_id', models.AutoField(primary_key=True, serialize=False)),
                ('hospital_patient_id', models.CharField(blank=True, max_length=100, null=True)),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('date_of_birth', models.DateField()),
                ('gender', models.CharField(choices=[('Male', 'Male'), ('Female', 'Female')], max_length=10)),
                ('mobile_number', models.CharField(max_length=15)),
                ('address', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Surgery',
            fields=[
                ('surgery_id', models.AutoField(primary_key=True, serialize=False)),
                ('surgeon_name', models.CharField(max_length=100)),
                ('surgery_type', models.CharField(max_length=100)),
                ('body_part', models.CharField(max_length=100)),
                ('additional_surgeon', models.CharField(blank=True, max_length=100, null=True)),
                ('anesthesiologist', models.CharField(blank=True, max_length=100, null=True)),
                ('surgery_history_details', models.TextField(blank=True, null=True)),
                ('surgery_date', models.DateField(blank=True, null=True)),
                ('operation_theatre_number', models.PositiveIntegerField(blank=True, null=True)),
                ('operation_status', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='Video',
            fields=[
                ('video_id', models.AutoField(primary_key=True, serialize=False)),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('video_file', models.URLField()),
                ('last_view_datetime', models.DateTimeField(blank=True, null=True)),
            ],
        ),
    ]
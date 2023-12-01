from django.db import models
from datetime import datetime
from user.models import User

class Patient(models.Model):
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
    ]

    patient_id = models.AutoField(primary_key=True)
    hospital_patient_id = models.CharField(max_length=100, blank=True, null=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    mobile_number = models.CharField(max_length=15)
    address = models.TextField()
    
    # def calculate_age(self):
    #     today = datetime.today()
    #     age = today.year - self.date_of_birth.year - ((today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day))
    #     return age

    # def save(self, *args, **kwargs):
    #     self.age = self.calculate_age()
    #     super(Patient, self).save(*args, **kwargs)

    def __str__(self):
        return f"Patient ID: {self.patient_id}, {self.first_name} {self.last_name}"

class Surgery(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='surgeries')
    surgery_id = models.AutoField(primary_key=True)
    surgeon_name = models.CharField(max_length=100)
    surgery_type = models.CharField(max_length=100)
    body_part = models.CharField(max_length=100)
    additional_surgeon = models.CharField(max_length=100, blank=True, null=True)
    anesthesiologist = models.CharField(max_length=100, blank=True, null=True)
    surgery_history_details = models.TextField(blank=True, null=True)
    surgery_date = models.DateField( blank=True, null=True)
    operation_theatre_number = models.PositiveIntegerField(null=True, blank=True)
    operation_status = models.BooleanField(default=False)

    def __str__(self):
        return f"Surgery ID: {self.surgery_id} for Patient ID: {self.patient.patient_id}, Type: {self.surgery_type}"
    
class Video(models.Model):
    video_id = models.AutoField(primary_key=True)
    created_date = models.DateTimeField(default=datetime.now, blank=True)
    video_file = models.CharField(max_length=200)
    surgery = models.ForeignKey(Surgery, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    last_view_datetime = models.DateTimeField(null=True, blank=True)
    # last_user_view = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Video ID: {self.video_id}"

class CommentVideo(models.Model):
    comment_id = models.AutoField(primary_key=True)
    date_time_comment = models.DateTimeField(auto_now_add=True)
    comment_text = models.TextField()
    headline = models.CharField(max_length=255)
    video = models.ForeignKey(Video, on_delete=models.CASCADE)

    def __str__(self):
        return f"Comment ID: {self.comment_id} on Video ID: {self.video.id}"

class Image(models.Model):
    image_id = models.AutoField(primary_key=True)
    created_date = models.DateTimeField(default=datetime.now, blank=True)
    image_file = models.CharField(max_length=200)
    surgery = models.ForeignKey(Surgery, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    last_view_datetime = models.DateTimeField(null=True, blank=True)
    # last_user_view = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Image ID: {self.image_id}"

class CommentImage(models.Model):
    comment_id = models.AutoField(primary_key=True)
    date_time_comment = models.DateTimeField(auto_now_add=True)
    comment_text = models.TextField()
    headline = models.CharField(max_length=255)
    image = models.ForeignKey(Image, on_delete=models.CASCADE)

    def __str__(self):
        return f"Comment ID: {self.comment_id} on Image ID: {self.image.id}"

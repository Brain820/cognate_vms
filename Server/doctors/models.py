from django.db import models

class Doctor(models.Model):
    doctor_name = models.CharField(max_length=100)
    profile_pic = models.ImageField(upload_to='static/doctors', blank=True, null=True)
    specialist = models.CharField(max_length=100)
    qualification = models.TextField()
    doctor_id = models.AutoField(primary_key=True)

    def __str__(self):
        return self.doctor_name

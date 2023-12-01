from django.db import models

class Company(models.Model):
    logo = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255)
    software_name = models.CharField(max_length=255)
    company_address = models.TextField()
    state = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    pin = models.CharField(max_length=10)
    company_email = models.EmailField()
    company_mobile_no = models.CharField(max_length=15)
    video_streaming = models.CharField(max_length=255)
    about_hospital = models.TextField()
    watermarked_logo = models.CharField(max_length=255, default="")
    storage_path = models.CharField(max_length=255, default="")

    def __str__(self):
        return f"{self.company_name}"
# from django.db import models

# class Company(models.Model):
#     logo = models.CharField(max_length=255)
#     company_name = models.CharField(max_length=255)
#     software_name = models.CharField(max_length=255)
#     company_address = models.TextField()
#     state = models.CharField(max_length=100)
#     district = models.CharField(max_length=100)
#     pin = models.CharField(max_length=10)
#     company_email = models.EmailField()
#     company_mobile_no = models.CharField(max_length=15)
#     video_streaming = models.CharField(max_length=255)
#     about_hospital = models.TextField()
#     watermarked_logo = models.CharField(max_length=255, default="")
#     storage_path = models.CharField(max_length=255, default="")

#     def __str__(self):
#         return f"{self.company_name}"

from django.db import models
camerachoices=[("Digest Auth Camera","Digest Auth Camera"),("Basic Auth Camera","Basic Auth Camera")]
wdrchoices=[("off","off"),("on","on")]
class Company(models.Model):
    logo = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255)
    software_name = models.CharField(max_length=255)
    company_address = models.TextField()
    state = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    pin = models.CharField(max_length=10)
    user = models.CharField(max_length=100,default='admin')
    password = models.CharField(max_length=10,default='123456')
    company_email = models.EmailField()
    company_mobile_no = models.CharField(max_length=15)
    video_streaming = models.CharField(max_length=255)
    about_hospital = models.TextField()
    watermarked_logo = models.CharField(max_length=255, default="")
    storage_path = models.CharField(max_length=255, default="")
    camera_ip=models.CharField(max_length=255,default="192.168.1.188")
    camera_type=models.CharField(max_length=255,default=camerachoices[0][0],choices=camerachoices)
    camera_framerate=models.IntegerField(default=15,blank=False)
    camera_wdr_status=models.CharField(max_length=255,default=wdrchoices[0][0],choices=wdrchoices,blank=False)
    camera_zoom_speed=models.IntegerField(default=5,blank=False)

    def __str__(self):
        return f"{self.company_name}"
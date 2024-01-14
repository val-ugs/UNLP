from django.db import models

class UploadedFile(models.Model):
    file = models.FileField(upload_to='files/')
    pattern = models.TextField(null=True)
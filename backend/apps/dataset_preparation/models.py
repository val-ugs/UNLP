from django.db import models

class LoadingData(models.Model):
    file = models.FileField(upload_to='files/')
    text_pattern_to_split = models.TextField(null=True)
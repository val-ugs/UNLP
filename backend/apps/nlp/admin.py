from django.contrib import admin
from . import models

admin.site.register(models.ClassificationModel)
admin.site.register(models.NerModel)
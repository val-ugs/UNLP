from django.db import models

class NerLabel(models.Model):
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=7)

class NlpText(models.Model):
    text = models.TextField()
    classification_label = models.CharField(max_length=100, null=True, blank=True)
    
class NlpToken(models.Model):
    token = models.TextField()
    pos = models.IntegerField()
    ner_label = models.OneToOneField(NerLabel, null=True, blank=True, on_delete=models.CASCADE)
    text = models.ForeignKey(NlpText, on_delete=models.CASCADE)

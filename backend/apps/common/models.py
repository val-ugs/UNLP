from django.db import models

class NlpDataset(models.Model):
    token_pattern_to_remove = models.CharField(max_length=100, null=True, blank=True,)
    token_pattern_to_split = models.CharField(max_length=100, null=True, blank=True,)

class NerLabel(models.Model):
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=7)
    nlp_dataset = models.ForeignKey(NlpDataset, on_delete=models.CASCADE)

class NlpText(models.Model):
    text = models.TextField()
    classification_label = models.CharField(max_length=100, null=True, blank=True)
    nlp_dataset = models.ForeignKey(NlpDataset, on_delete=models.CASCADE)
    
class NlpTokenNerLabel(models.Model):
    ner_label = models.OneToOneField(NerLabel, null=True, blank=True, on_delete=models.CASCADE)
    initial = models.BooleanField(default=True)

class NlpToken(models.Model):
    token = models.TextField(null=True, blank=True)
    pos = models.IntegerField(null=True)
    ner_label = models.OneToOneField(NlpTokenNerLabel, null=True, blank=True, on_delete=models.CASCADE)
    nlp_text = models.ForeignKey(NlpText, on_delete=models.CASCADE)
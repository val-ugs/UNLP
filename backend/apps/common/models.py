from django.db import models

class NlpDataset(models.Model):
    token_pattern_to_remove = models.CharField(max_length=500, null=True, blank=True,)
    token_pattern_to_split = models.CharField(max_length=500, null=True, blank=True,)

class NerLabel(models.Model):
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=7)
    nlp_dataset = models.ForeignKey(NlpDataset, null=True, blank=True, on_delete=models.CASCADE)

class NlpText(models.Model):
    text = models.TextField()
    classification_label = models.CharField(max_length=100, null=True, blank=True)
    summarization = models.TextField(null=True, blank=True)
    nlp_dataset = models.ForeignKey(NlpDataset, null=True, blank=True, on_delete=models.CASCADE)

class NlpToken(models.Model):
    token = models.TextField(null=True, blank=True)
    pos = models.IntegerField(null=True)
    nlp_text = models.ForeignKey(NlpText, null=True, blank=True, on_delete=models.CASCADE)

class NlpTokenNerLabel(models.Model):
    nlp_token = models.OneToOneField(NlpToken, blank=True, on_delete=models.CASCADE, primary_key=True)
    ner_label = models.ForeignKey(NerLabel, null=True, blank=True, on_delete=models.CASCADE)
    initial = models.BooleanField(default=True)
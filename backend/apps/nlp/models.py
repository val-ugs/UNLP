from django.db import models

from apps.common.models import NlpDataset

class ModelType(models.TextChoices):
    CLASSIFICATION = 'Classification',
    NER = 'Ner'

class HuggingFaceModel(models.Model):
    name = models.CharField(max_length=200)
    model_name_or_path = models.CharField(max_length=200)
    train_nlp_dataset = models.ForeignKey(NlpDataset, null=True, blank=True, on_delete=models.CASCADE)
    type = models.CharField(
        max_length=14,
        choices=ModelType.choices,
    )

class TrainingArgs(models.Model):
    hugging_face_model = models.OneToOneField(HuggingFaceModel, blank=True, on_delete=models.CASCADE, primary_key=True)
    learning_rate = models.FloatField()
    per_device_train_batch_size = models.IntegerField()
    per_device_eval_batch_size = models.IntegerField()
    num_train_epochs = models.IntegerField()
    weight_decay = models.FloatField()
    evaluation_strategy = models.CharField(max_length=5)
    save_strategy = models.CharField(max_length=5)
    load_best_model_at_end = models.BooleanField()
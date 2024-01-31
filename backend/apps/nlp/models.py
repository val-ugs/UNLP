from django.db import models


class ModelType(models.TextChoices):
    CLASSIFICATION = 'Classification',
    NER = 'Ner'

class Trainer(models.Model):
    model_name_or_path = models.CharField(max_length=200)
    type = models.CharField(
        max_length=14,
        choices=ModelType.choices,
        null=True,
        blank=True
    )

    class Meta:
        managed = False

class TrainingArgs(models.Model):
    trainer = models.ForeignKey(Trainer, on_delete=models.CASCADE)
    output_model_name = models.CharField(max_length=200),
    learning_rate=models.FloatField(),
    per_device_train_batch_size=models.IntegerField(),
    per_device_eval_batch_size=models.IntegerField(),
    num_train_epochs=models.IntegerField(),
    weight_decay=models.FloatField(),
    evaluation_strategy=models.CharField(max_length=5),
    save_strategy=models.CharField(max_length=5),
    load_best_model_at_end=models.BooleanField(),

    class Meta:
        managed = False

class Predictor(models.Model):
    model_name_or_path = models.CharField(max_length=200)
    type = models.CharField(
        max_length=14,
        choices=ModelType.choices,
        null=True,
        blank=True
    )
    
    class Meta:
        managed = False
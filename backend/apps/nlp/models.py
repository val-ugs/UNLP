from django.db import models

class ClassificationModel(models.Model):
    model_name_or_path = models.CharField(max_length=200)

class ClassificationModelTrain(models.Model):
    model_name_or_path = models.CharField(max_length=200)
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

class ClassificationModelPredict(models.Model):
    model_name_or_path = models.CharField(max_length=200)
    
    class Meta:
        managed = False

class NerModel(models.Model):
    model_name_or_path = models.CharField(max_length=200)

class NerModelTrain(models.Model):
    model_name_or_path = models.CharField(max_length=200)
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


class NerModelPredict(models.Model):
    model_name_or_path = models.CharField(max_length=200)

    class Meta:
        managed = False
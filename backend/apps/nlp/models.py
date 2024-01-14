from django.db import models

class Label(models.Model):
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=7)

class NlpText(models.Model):
    text = models.TextField()
    title = models.CharField(max_length=100)
    
class NlpToken(models.Model):
    token = models.TextField()
    pos = models.IntegerField()
    label = models.OneToOneField(Label, on_delete=models.CASCADE)
    text = models.ForeignKey(NlpText, on_delete=models.CASCADE)

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
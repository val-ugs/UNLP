from rest_framework.serializers import ModelSerializer
from .models import Trainer, TrainingArgs, Predictor

class TrainingArgsSerializer(ModelSerializer):
    class Meta:
        model = TrainingArgs
        fields = '__all__'

class TrainerSerializer(ModelSerializer):
    training_args = TrainingArgsSerializer()

    class Meta:
        model = Trainer
        fields = '__all__'

class PredictorSerializer(ModelSerializer):
    class Meta:
        model = Predictor
        fields = '__all__'
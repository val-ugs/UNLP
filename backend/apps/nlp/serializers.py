from rest_framework.serializers import ModelSerializer, SerializerMethodField
from .models import HuggingFaceModel, TrainingArgs

class TrainingArgsSerializer(ModelSerializer):
    class Meta:
        model = TrainingArgs
        fields = '__all__'

class HuggingFaceModelSerializer(ModelSerializer):
    training_args = SerializerMethodField(method_name='get_training_args')

    class Meta:
        model = HuggingFaceModel
        fields = '__all__'

    def get_training_args(self, obj):
        try:
            training_args = TrainingArgs.objects.get(hugging_face_model=obj)
        except TrainingArgs.DoesNotExist:
            training_args = None
        return TrainingArgsSerializer(training_args).data
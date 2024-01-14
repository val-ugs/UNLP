from rest_framework.serializers import ModelSerializer
from .models import ClassificationModel, ClassificationModelTrain, ClassificationModelPredict, NerModel, NerModelTrain, NerModelPredict

class ClassificationModelSerializer(ModelSerializer):
    class Meta:
        model = ClassificationModel
        fields = '__all__'

class ClassificationModelTrainSerializer(ModelSerializer):
    class Meta:
        model = ClassificationModelTrain
        fields = '__all__'

class ClassificationModelPredictSerializer(ModelSerializer):
    class Meta:
        model = ClassificationModelPredict
        fields = '__all__'

class NerModelSerializer(ModelSerializer):
    class Meta:
        model = NerModel
        fields = '__all__'

class NerModelTrainSerializer(ModelSerializer):
    class Meta:
        model = NerModelTrain
        fields = '__all__'

class NerModelPredictSerializer(ModelSerializer):
    class Meta:
        model = NerModelPredict
        fields = '__all__'
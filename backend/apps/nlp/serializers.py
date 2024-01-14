from rest_framework.serializers import ModelSerializer, SerializerMethodField
from .models import Label, NlpText, NlpToken, ClassificationModel, ClassificationModelTrain, ClassificationModelPredict, NerModel, NerModelTrain, NerModelPredict

class LabelSerializer(ModelSerializer):
    class Meta:
        model = Label
        fields = '__all__'

class NlpTextSerializer(ModelSerializer):
    tokens = SerializerMethodField()

    class Meta:
        model = NlpText
        fields = ('text', 'title', 'tokens')

    def get_tokens(self, obj):
        
        tokens = NlpToken.objects.filter(text=obj)
        return NlpTokenSerializer(tokens, many=True).data

class NlpTokenSerializer(ModelSerializer):
    class Meta:
        model = NlpToken
        fields = '__all__'

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
from rest_framework.serializers import ModelSerializer, SerializerMethodField
from .models import NerLabel, NlpDataset, NlpText, NlpToken

class NerLabelSerializer(ModelSerializer):
    class Meta:
        model = NerLabel
        fields = '__all__'

class NlpDatasetSerializer(ModelSerializer):
    nlp_texts = SerializerMethodField(method_name='get_nlp_texts')

    class Meta:
        model = NlpDataset
        fields = '__all__'

    def get_nlp_texts(self, obj):
        nlp_texts = NlpText.objects.filter(nlp_dataset=obj)
        return NlpTextSerializer(nlp_texts, many=True).data

class NlpTextSerializer(ModelSerializer):
    nlp_tokens = SerializerMethodField(method_name='get_nlp_tokens')

    class Meta:
        model = NlpText
        fields = '__all__'

    def get_nlp_tokens(self, obj):
        nlp_tokens = NlpToken.objects.filter(text=obj)
        return NlpTokenSerializer(nlp_tokens, many=True).data

class NlpTokenSerializer(ModelSerializer):
    class Meta:
        model = NlpToken
        fields = '__all__'
from rest_framework.serializers import ModelSerializer, SerializerMethodField
from .models import NerLabel, NlpText, NlpToken

class NerLabelSerializer(ModelSerializer):
    class Meta:
        model = NerLabel
        fields = '__all__'

class NlpTextSerializer(ModelSerializer):
    nlp_tokens = SerializerMethodField(method_name='get_nlp_tokens')

    class Meta:
        model = NlpText
        fields = '__all__'

    def get_nlp_tokens(self, obj):
        tokens = NlpToken.objects.filter(text=obj)
        return NlpTokenSerializer(tokens, many=True).data

class NlpTokenSerializer(ModelSerializer):
    class Meta:
        model = NlpToken
        fields = '__all__'
from django.shortcuts import get_object_or_404
from rest_framework.serializers import ModelSerializer, SerializerMethodField, IntegerField
from .models import NerLabel, NlpDataset, NlpText, NlpToken, NlpTokenNerLabel

# main serializers
class NlpDatasetSerializer(ModelSerializer):
    class Meta:
        model = NlpDataset
        fields = '__all__'
    
class NerLabelSerializer(ModelSerializer):
    class Meta:
        model = NerLabel
        fields = '__all__'

class NlpTextSerializer(ModelSerializer):
    class Meta:
        model = NlpText
        fields = '__all__'

class NlpTokenSerializer(ModelSerializer):
    class Meta:
        model = NlpToken
        fields = '__all__'

class NlpTokenNerLabelSerializer(ModelSerializer):
    class Meta:
        model = NlpTokenNerLabel
        fields = '__all__'

# full serializers
class NlpDatasetFullSerializer(ModelSerializer):
    nlp_texts = SerializerMethodField(method_name='get_nlp_texts')
    ner_labels = SerializerMethodField(method_name='get_ner_labels')

    class Meta:
        model = NlpDataset
        fields = '__all__'

    def get_nlp_texts(self, obj):
        nlp_texts = NlpText.objects.filter(nlp_dataset=obj)
        return NlpTextFullSerializer(nlp_texts, many=True).data
    
    def get_ner_labels(self, obj):
        ner_labels = NerLabel.objects.filter(nlp_dataset=obj)
        return NerLabelSerializer(ner_labels, many=True).data

class NlpTextFullSerializer(ModelSerializer):
    nlp_tokens = SerializerMethodField(method_name='get_nlp_tokens')

    class Meta:
        model = NlpText
        fields = '__all__'

    def get_nlp_tokens(self, obj):
        nlp_tokens = NlpToken.objects.filter(nlp_text=obj)
        return NlpTokenFullSerializer(nlp_tokens, many=True).data

class NlpTokenFullSerializer(ModelSerializer):
    nlp_token_ner_label = SerializerMethodField(method_name='get_nlp_token_ner_label')

    class Meta:
        model = NlpToken
        fields = '__all__'

    def get_nlp_token_ner_label(self, obj):
        try:
            nlp_token_ner_label = NlpTokenNerLabel.objects.get(nlp_token=obj)
        except NlpTokenNerLabel.DoesNotExist:
            nlp_token_ner_label = None
        return NlpTokenNerLabelSerializer(nlp_token_ner_label).data
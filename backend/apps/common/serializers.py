from django.shortcuts import get_object_or_404
from rest_framework.serializers import ModelSerializer, SerializerMethodField, IntegerField
from .models import NerLabel, NlpDataset, NlpText, NlpToken, NlpTokenNerLabel

class NlpDatasetSerializer(ModelSerializer):
    nlp_texts = SerializerMethodField(method_name='get_nlp_texts')
    ner_labels = SerializerMethodField(method_name='get_ner_labels')

    class Meta:
        model = NlpDataset
        fields = '__all__'

    def get_nlp_texts(self, obj):
        nlp_texts = NlpText.objects.filter(nlp_dataset=obj)
        return NlpTextSerializer(nlp_texts, many=True).data
    
    def get_ner_labels(self, obj):
        ner_labels = NerLabel.objects.filter(nlp_dataset=obj)
        return NerLabelSerializer(ner_labels, many=True).data
    
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
        nlp_tokens = NlpToken.objects.filter(nlp_text=obj)
        return NlpTokenSerializer(nlp_tokens, many=True).data

class NlpTokenSerializer(ModelSerializer):
    class Meta:
        model = NlpToken
        fields = '__all__'

class NlpTokenNerLabelSerializer(ModelSerializer):
    ner_label = NerLabelSerializer()

    class Meta:
        model = NlpTokenNerLabel
        fields = '__all__'

    def create(self, validated_data):
        ner_label_data = validated_data.pop('ner_label')
        ner_label = get_object_or_404(NerLabel, **ner_label_data)
        nlp_token_ner_label, _ = NlpTokenNerLabel.objects.get_or_create(ner_label = ner_label, **validated_data)
        return nlp_token_ner_label

    def update(self, instance, validated_data):
        ner_label_data = validated_data.pop('ner_label')
        instance.ner_label = get_object_or_404(NerLabel, **ner_label_data)
        instance.save()
        return instance

# class NlpTokenNerLabelReadSerializer(ModelSerializer):
#     ner_label = NerLabelSerializer()
#     # ner_label = SerializerMethodField(method_name='get_ner_label')

#     class Meta:
#         model = NlpTokenNerLabel
#         fields = '__all__'

#     # def get_ner_label(self, obj):
#     #     return NerLabelSerializer(obj.ner_label).data
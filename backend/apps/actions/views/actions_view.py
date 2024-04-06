from io import BytesIO
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from apps.common.models import NerLabel, NlpDataset, NlpText, NlpToken, NlpTokenNerLabel
from apps.common.serializers import NlpDatasetSerializer

from copy import deepcopy

@api_view(['GET'])
def copy_nlp_dataset(request, nlp_dataset_pk):
    # copy nlp_dataset
    nlp_dataset = get_object_or_404(NlpDataset, pk=nlp_dataset_pk)
    nlp_dataset_copy = deepcopy(nlp_dataset)
    nlp_dataset_copy.pk = None
    nlp_dataset_copy.save()

    # copy ner_labels
    ner_labels = NerLabel.objects.filter(nlp_dataset=nlp_dataset)
    for ner_label in ner_labels:
        ner_label_copy = deepcopy(ner_label)
        ner_label_copy.pk = None
        ner_label_copy.nlp_dataset = nlp_dataset_copy
        ner_label_copy.save()

    # copy nlp_texts
    nlp_texts = NlpText.objects.filter(nlp_dataset=nlp_dataset)
    for nlp_text in nlp_texts:
        nlp_text_copy = deepcopy(nlp_text)
        nlp_text_copy.pk = None
        nlp_text_copy.nlp_dataset = nlp_dataset_copy
        nlp_text_copy.save()

        # copy nlp_tokens
        nlp_tokens = NlpToken.objects.filter(nlp_text=nlp_text)
        for nlp_token in nlp_tokens:
            nlp_token_copy = deepcopy(nlp_token)
            nlp_token_copy.pk = None
            nlp_token_copy.nlp_text = nlp_text_copy
            nlp_token_copy.save()

            # copy nlp_token_ner_labels
            nlp_token_ner_labels = NlpTokenNerLabel.objects.filter(nlp_token=nlp_token)
            for nlp_token_ner_label in nlp_token_ner_labels:
                nlp_token_ner_label_copy = deepcopy(nlp_token_ner_label)
                nlp_token_ner_label_copy.pk = None
                nlp_token_ner_label_copy.nlp_token = nlp_token_copy
                nlp_token_ner_label_copy.ner_label = get_object_or_404(NerLabel, name=nlp_token_ner_label.ner_label.name, nlp_dataset=nlp_dataset_copy)
                nlp_token_ner_label_copy.save()

    nlp_dataset_serializer = NlpDatasetSerializer(nlp_dataset_copy)
        
    return Response(nlp_dataset_serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def clear_nlp_dataset(request, nlp_dataset_pk):
    field = request.GET.get('field', '')

    if field == 'classification-label':
        nlp_texts = NlpText.objects.filter(nlp_dataset=nlp_dataset_pk)
        for nlp_text in nlp_texts:
            nlp_text.classification_label = None
            nlp_text.save()
    
    if field == 'ner-label':
        ner_labels = NerLabel.objects.filter(nlp_dataset=nlp_dataset_pk)
        for ner_label in ner_labels:
            ner_label.delete()

    if field == 'summarization':
        nlp_texts = NlpText.objects.filter(nlp_dataset=nlp_dataset_pk)
        for nlp_text in nlp_texts:
            nlp_text.summarization = None
            nlp_text.save()
    
    nlp_dataset = get_object_or_404(NlpDataset, pk=nlp_dataset_pk)
    nlp_dataset_serializer = NlpDatasetSerializer(nlp_dataset)

    return Response(nlp_dataset_serializer.data, status=status.HTTP_200_OK)
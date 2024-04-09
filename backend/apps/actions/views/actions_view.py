from io import BytesIO
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.renderers import JSONRenderer

from apps.common.models import NerLabel, NlpDataset, NlpText, NlpToken, NlpTokenNerLabel
from apps.common.serializers import NerLabelSerializer, NlpDatasetFullSerializer, NlpDatasetSerializer, NlpTextSerializer, NlpTokenNerLabelSerializer, NlpTokenSerializer

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
        
    return Response(status=status.HTTP_200_OK)

@api_view(['GET'])
def clear_nlp_dataset(request, nlp_dataset_pk):
    field = request.GET.get('field', '')

    if field == 'classification-label':
        nlp_texts = NlpText.objects.filter(nlp_dataset=nlp_dataset_pk)
        for nlp_text in nlp_texts:
            nlp_text.classification_label = None
            nlp_text.save()
        return Response(status=status.HTTP_200_OK)
    
    if field == 'ner-label':
        ner_labels = NerLabel.objects.filter(nlp_dataset=nlp_dataset_pk)
        for ner_label in ner_labels:
            ner_label.delete()
        return Response(status=status.HTTP_200_OK)

    if field == 'summarization':
        nlp_texts = NlpText.objects.filter(nlp_dataset=nlp_dataset_pk)
        for nlp_text in nlp_texts:
            nlp_text.summarization = None
            nlp_text.save()
        return Response(status=status.HTTP_200_OK)

    return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def create_dataset_by_field(request, nlp_dataset_pk):
    # copy nlp_dataset
    nlp_dataset = get_object_or_404(NlpDataset, pk=nlp_dataset_pk)
    nlp_dataset_copy = deepcopy(nlp_dataset)
    nlp_dataset_copy.pk = None
    nlp_dataset_copy.save()

    field = request.GET.get('field', '')
    ner_label_id = request.GET.get('ner-label-id')
    is_classification_label_saved = request.GET.get('is-classification-label-saved', 'False')
    is_summarization_saved = request.GET.get('is-summarization-saved', 'False')

    nlp_texts = NlpText.objects.filter(nlp_dataset=nlp_dataset)

    # copy dataset by classification-label
    if field == "classification-label":
        for nlp_text in nlp_texts:
            if not nlp_text.classification_label:
                continue
            nlp_text_copy = NlpText.objects.create()
            nlp_text_copy.text = nlp_text.classification_label
            save_fields(nlp_text_copy, nlp_text, is_classification_label_saved, is_summarization_saved)
            nlp_text_copy.nlp_dataset = nlp_dataset_copy
            nlp_text_copy.save()
        return Response(status=status.HTTP_200_OK)
    
    # copy dataset by summarization
    elif field == "summarization":
        for nlp_text in nlp_texts:
            if not nlp_text.summarization:
                continue
            nlp_text_copy = NlpText.objects.create()
            nlp_text_copy.text = nlp_text.summarization
            save_fields(nlp_text_copy, nlp_text, is_classification_label_saved, is_summarization_saved)
            nlp_text_copy.nlp_dataset = nlp_dataset_copy
            nlp_text_copy.save()
        return Response(status=status.HTTP_200_OK)
    
    # copy dataset by ner-label
    elif field == "ner-label":
        nlp_tokens_ner_label = NlpTokenNerLabel.objects.filter(ner_label=ner_label_id).order_by('nlp_token')
        nlp_text_copy = NlpText.objects.create()
        nlp_text_copy.nlp_dataset = nlp_dataset_copy
        isNewWord = True
        for nlp_token_ner_label in nlp_tokens_ner_label:
            nlp_token = get_object_or_404(NlpToken, pk=nlp_token_ner_label.nlp_token.pk)
            
            if nlp_token_ner_label.initial == 1:
                if isNewWord == False:
                    nlp_text = get_object_or_404(NlpText, pk=nlp_token.nlp_text.pk, nlp_dataset=nlp_dataset_pk)
                    save_fields(nlp_text_copy, nlp_text, is_classification_label_saved, is_summarization_saved)
                    nlp_text_copy.save()
                    nlp_text_copy = NlpText.objects.create()
                    nlp_text_copy.nlp_dataset = nlp_dataset_copy
                    isNewWord = True
                isNewWord = False
            
            nlp_text_copy.text = nlp_token.token if not nlp_text_copy.text else nlp_text_copy.text + " " + nlp_token.token
        nlp_text = get_object_or_404(NlpText, pk=nlp_token.nlp_text.pk, nlp_dataset=nlp_dataset_pk)
        save_fields(nlp_text_copy, nlp_text, is_classification_label_saved, is_summarization_saved)
        nlp_text_copy.save()
        return Response(status=status.HTTP_200_OK)
        
    return Response(status=status.HTTP_400_BAD_REQUEST)

def save_fields(nlp_text_copy, nlp_text, is_classification_label_saved, is_summarization_saved):
    if is_classification_label_saved:
        nlp_text_copy.classification_label = nlp_text.classification_label
    if is_summarization_saved:
        nlp_text_copy.summarization = nlp_text.summarization
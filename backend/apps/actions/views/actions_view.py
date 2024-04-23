from collections import defaultdict
from io import BytesIO
import re
import json
from django.shortcuts import get_object_or_404
from django.db import transaction
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

    match field:
        case 'classification-label':
            nlp_texts = NlpText.objects.filter(nlp_dataset=nlp_dataset_pk)
            for nlp_text in nlp_texts:
                nlp_text.classification_label = None
                nlp_text.save()
    
        case 'ner-label':
            ner_labels = NerLabel.objects.filter(nlp_dataset=nlp_dataset_pk)
            for ner_label in ner_labels:
                ner_label.delete()

        case 'summarization':
            nlp_texts = NlpText.objects.filter(nlp_dataset=nlp_dataset_pk)
            for nlp_text in nlp_texts:
                nlp_text.summarization = None
                nlp_text.save()
    
    nlp_dataset = get_object_or_404(NlpDataset, pk=nlp_dataset_pk)
    nlp_dataset_serializer = NlpDatasetSerializer(nlp_dataset)

    return Response(nlp_dataset_serializer.data, status=status.HTTP_200_OK)

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

    match field:
        # copy dataset by classification-label
        case "classification-label":
            for nlp_text in nlp_texts:
                if not nlp_text.classification_label:
                    continue
                nlp_text_copy = NlpText.objects.create()
                nlp_text_copy.text = nlp_text.classification_label
                try_save_fields(nlp_text_copy, nlp_text, is_classification_label_saved, is_summarization_saved)
                nlp_text_copy.nlp_dataset = nlp_dataset_copy
                nlp_text_copy.save()
    
        # copy dataset by summarization
        case "summarization":
            for nlp_text in nlp_texts:
                if not nlp_text.summarization:
                    continue
                nlp_text_copy = NlpText.objects.create()
                nlp_text_copy.text = nlp_text.summarization
                try_save_fields(nlp_text_copy, nlp_text, is_classification_label_saved, is_summarization_saved)
                nlp_text_copy.nlp_dataset = nlp_dataset_copy
                nlp_text_copy.save()
    
        # copy dataset by ner-label
        case "ner-label":
            nlp_tokens_ner_label = NlpTokenNerLabel.objects.filter(ner_label=ner_label_id).order_by('nlp_token')
            nlp_text_copy = NlpText.objects.create()
            nlp_text_copy.nlp_dataset = nlp_dataset_copy
            isNewWord = True
            for nlp_token_ner_label in nlp_tokens_ner_label:
                nlp_token = get_object_or_404(NlpToken, pk=nlp_token_ner_label.nlp_token.pk)
                
                if nlp_token_ner_label.initial == 1:
                    if isNewWord == False:
                        nlp_text = get_object_or_404(NlpText, pk=nlp_token.nlp_text.pk, nlp_dataset=nlp_dataset_pk)
                        try_save_fields(nlp_text_copy, nlp_text, is_classification_label_saved, is_summarization_saved)
                        nlp_text_copy.save()
                        nlp_text_copy = NlpText.objects.create()
                        nlp_text_copy.nlp_dataset = nlp_dataset_copy
                        isNewWord = True
                    isNewWord = False
                
                nlp_text_copy.text = nlp_token.token if not nlp_text_copy.text else f'{nlp_text_copy.text} {nlp_token.token}'
            nlp_text = get_object_or_404(NlpText, pk=nlp_token.nlp_text.pk, nlp_dataset=nlp_dataset_pk)
            try_save_fields(nlp_text_copy, nlp_text, is_classification_label_saved, is_summarization_saved)
            nlp_text_copy.save()
        
    nlp_dataset_serializer = NlpDatasetSerializer(nlp_dataset_copy)

    return Response(nlp_dataset_serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def delete_texts_without_fields(request, nlp_dataset_pk):
    nlp_dataset = get_object_or_404(NlpDataset, pk=nlp_dataset_pk)

    nlp_texts = NlpText.objects.filter(nlp_dataset=nlp_dataset)
    for nlp_text in nlp_texts:
        if (not nlp_text.classification_label and not nlp_text.summarization and has_tokens_without_ner_labels(nlp_text)) :
            nlp_text.delete()

    nlp_dataset_serializer = NlpDatasetSerializer(nlp_dataset)
        
    return Response(nlp_dataset_serializer.data, status=status.HTTP_200_OK)

def has_tokens_without_ner_labels(nlp_text):
    nlp_tokens = NlpToken.objects.filter(nlp_text=nlp_text)
    for nlp_token in nlp_tokens:
        nlp_token_ner_labels = NlpTokenNerLabel.objects.filter(nlp_token=nlp_token)
        if (len(nlp_token_ner_labels) > 0):
            return False
    return True
    

def try_save_fields(nlp_text_copy, nlp_text, is_classification_label_saved, is_summarization_saved):
    if is_classification_label_saved:
        nlp_text_copy.classification_label = nlp_text.classification_label
    if is_summarization_saved:
        nlp_text_copy.summarization = nlp_text.summarization

@api_view(['POST'])
def create_nlp_token_ner_labels_by_pattern(request, nlp_dataset_pk):
    try:
        ner_label_patterns = request.body
        if not ner_label_patterns:
            return Response("ner_label_patterns not set", status=status.HTTP_400_BAD_REQUEST)
        
        nlp_dataset = get_object_or_404(NlpDataset, pk=nlp_dataset_pk)
        nlp_texts = NlpText.objects.filter(nlp_dataset=nlp_dataset_pk)

        ner_label_patterns = json.loads(ner_label_patterns)

        with transaction.atomic():
            for ner_label_pattern in ner_label_patterns:
                ner_label_id = ner_label_pattern['ner_label_id']
                pattern = ner_label_pattern['pattern']
                ner_label = get_object_or_404(NerLabel, pk=ner_label_id)
                
                for nlp_text in nlp_texts:
                    tokens = tokenize(nlp_text.text, nlp_dataset.token_pattern_to_remove, nlp_dataset.token_pattern_to_split)
                    
                    concidences = re.findall(pattern, nlp_text.text)
                    for concidence in concidences:
                        ner_label_tokens = tokenize(concidence, nlp_dataset.token_pattern_to_remove, nlp_dataset.token_pattern_to_split)
                        pos = tokens.index(ner_label_tokens[0])
                        for ner_label_token in ner_label_tokens:
                            nlp_token = get_object_or_404(NlpToken, nlp_text=nlp_text, token=ner_label_token, pos=pos)
                            nlp_token_ner_label, _ = NlpTokenNerLabel.objects.get_or_create(nlp_token=nlp_token)
                            if (nlp_token_ner_label.ner_label):
                                raise Exception(f"Collision: for tokens found by pattern {pattern}, the ner label is already defined (nlp_text=\"{nlp_text.text}\",ner_label=\"{nlp_token_ner_label.ner_label.name}\").")

                            nlp_token_ner_label.ner_label = ner_label
                            nlp_token_ner_label.initial = ner_label_token == ner_label_tokens[0]
                            nlp_token_ner_label.save()
                            pos += 1

        nlp_dataset_serializer = NlpDatasetSerializer(nlp_dataset)
        return Response(nlp_dataset_serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
def tokenize(line, token_pattern_to_remove, token_pattern_to_split):
    line = str(line)
    line = re.sub(token_pattern_to_remove, '', line)
    line = re.split(token_pattern_to_split, line)
    line = list(filter(None, line)) # remove empty strings
    return line

@api_view(['POST'])
def create_nlp_dataset_by_template(request):
    try:
        template_dataset = request.body
        template_dataset = json.loads(template_dataset)

        nlp_dataset_pks = template_dataset['nlp_dataset_pks']
        template = template_dataset['template']
        delimiter = template_dataset['delimiter']

        nlp_dataset_template = NlpDataset.objects.create()
        nlp_dataset_template.save()
        
        len = -1
        for nlp_dataset_pk in nlp_dataset_pks:
            nlp_texts = NlpText.objects.filter(nlp_dataset=nlp_dataset_pk)
            if (len == -1):
                len = nlp_texts.count()
                continue
            if (len != nlp_texts.count()):
                raise Exception('The length of the datasets is not equal')
        for i in range(0, len):
            template_copy = template
            for nlp_dataset_pk in nlp_dataset_pks:
                try:
                    nlp_text = NlpText.objects.filter(nlp_dataset=nlp_dataset_pk).order_by('pk')[i]
                except NlpTokenNerLabel.DoesNotExist:
                    nlp_text = None
                dict = defaultdict(str)
                nlp_tokens = NlpToken.objects.filter(nlp_text=nlp_text)
                for nlp_token in nlp_tokens:
                    try:
                        nlp_token_ner_label = NlpTokenNerLabel.objects.get(nlp_token=nlp_token)
                    except NlpTokenNerLabel.DoesNotExist:
                        nlp_token_ner_label = None
                    
                    if (nlp_token_ner_label and nlp_token_ner_label.ner_label):
                        ner_label = nlp_token_ner_label.ner_label
                        if not dict[ner_label.name]:
                            dict[ner_label.name] = nlp_token.token
                        else:
                            if (nlp_token_ner_label.initial == 0):
                                dict[ner_label.name] += f" {nlp_token.token}"
                            else:
                                dict[ner_label.name] += f"{delimiter}{nlp_token.token}"
                for key in dict:
                    template_copy = template_copy.replace(f"<{key}>", dict[key])
                template_copy = template_copy if not nlp_text.classification_label else template_copy.replace(f"<{"classification_label"}>", nlp_text.classification_label)
                template_copy = template_copy if not nlp_text.summarization else template_copy.replace(f"<{"summarization"}>", nlp_text.summarization)

            nlp_text_template = NlpText.objects.create()
            nlp_text_template.text = template_copy
            nlp_text_template.nlp_dataset = nlp_dataset_template
            nlp_text_template.save()

        nlp_dataset_serializer = NlpDatasetSerializer(nlp_dataset_template)
        
        return Response(nlp_dataset_serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
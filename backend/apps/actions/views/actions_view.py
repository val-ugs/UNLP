from collections import defaultdict
from io import BytesIO
import re
import os
import json
from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from apps.common.models import NerLabel, NlpDataset, NlpText, NlpToken, NlpTokenNerLabel
from apps.common.serializers import NerLabelSerializer, NlpDatasetSerializer, NlpTextSerializer, NlpTokenNerLabelSerializer, NlpTokenSerializer

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
                    
                    processed_posses = []
                    for concidence in concidences:
                        # get first appearance (remove bug with duplicates)
                        index = nlp_text.text.index(concidence)
                        substring = nlp_text.text[0:index]
                        substring = re.sub(nlp_dataset.token_pattern_to_remove, '', substring)
                        substring = re.sub(nlp_dataset.token_pattern_to_split, '', substring)
                        token_first_appearance = 0
                        sum = 0
                        for i, token in enumerate(tokens):
                            sum += len(token)
                            if (sum > len(substring)):
                                token_first_appearance = i
                                break

                        # get ner_label_tokens
                        ner_label_tokens = tokenize(concidence, nlp_dataset.token_pattern_to_remove, nlp_dataset.token_pattern_to_split)
                        line_of_ner_label_tokens = " ".join(str(element) for element in ner_label_tokens)

                        # take start posses of tokens
                        start_posses = []
                        for start_pos in [i for i, x in enumerate(tokens) if x == ner_label_tokens[0]]:
                            current_tokens = tokens[start_pos:start_pos+len(ner_label_tokens)]
                            line_of_current_tokens = " ".join(str(element) for element in current_tokens)
                            if (line_of_current_tokens == line_of_ner_label_tokens and start_pos >= token_first_appearance):
                                start_posses.append(start_pos)
                        
                        unprocessed_posses = list(set(start_posses) - set(processed_posses))
                        unprocessed_posses.sort()
                        if not unprocessed_posses:
                            continue

                        pos = unprocessed_posses[0]
                        for ner_label_token in ner_label_tokens:
                            nlp_token = get_object_or_404(NlpToken, nlp_text=nlp_text, token=ner_label_token, pos=pos)
                            nlp_token_ner_label, _ = NlpTokenNerLabel.objects.get_or_create(nlp_token=nlp_token)
                            if (nlp_token_ner_label.ner_label):
                                raise Exception(f"Collision: for tokens found by pattern {pattern}, the ner label is already defined (nlp_text=\"{nlp_text.text}\",ner_label=\"{nlp_token_ner_label.ner_label.name}\").")

                            nlp_token_ner_label.ner_label = ner_label
                            nlp_token_ner_label.initial = ner_label_token == ner_label_tokens[0]
                            nlp_token_ner_label.save()
                            processed_posses.append(pos)
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

        if not nlp_dataset_pks:
            raise Exception('Datasets not defined')
        
        first_nlp_text = NlpText.objects.filter(nlp_dataset=nlp_dataset_pks[0])
        len = first_nlp_text.count()
        for nlp_dataset_pk in nlp_dataset_pks:
            nlp_texts = NlpText.objects.filter(nlp_dataset=nlp_dataset_pk)
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
                    
                    if (not nlp_token_ner_label or not nlp_token_ner_label.ner_label):
                        continue

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
                template_copy = template_copy if not nlp_text.classification_label else template_copy.replace(f"<classification_label>", nlp_text.classification_label)
                template_copy = template_copy if not nlp_text.summarization else template_copy.replace(f"<summarization>", nlp_text.summarization)

            nlp_text_template = NlpText.objects.create()
            nlp_text_template.text = template_copy
            nlp_text_template.nlp_dataset = nlp_dataset_template
            nlp_text_template.save()

        nlp_dataset_serializer = NlpDatasetSerializer(nlp_dataset_template)
        
        return Response(nlp_dataset_serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def load_nlp_dataset_from_file(request, pk=None):
    """
    if json file then get nlp_dataset
    if txt file then add data to nlp_dataset (if not exists create nlp_dataset) and try tokenize 
    """
    params = json.loads(request.body)
    print(params)
    file_path = params['file_path']
    filename = os.path.basename(file_path)
    f = open(file_path, 'r')
    content = None

    if filename.endswith('.txt'):
        text_pattern_to_split = params['text_pattern_to_split']
        if (content == None): # If not read at the unzip stage
            content = f.read().decode()

        nlp_dataset, _ = NlpDataset.objects.get_or_create(pk=pk)
        
        if text_pattern_to_split:
            # split text based on pattern
            texts = re.split(text_pattern_to_split, content)

            for text in texts:
                NlpText.objects.create(text=text.strip(), nlp_dataset=nlp_dataset)
        else:
            NlpText.objects.create(text=content, nlp_dataset=nlp_dataset)
        
        nlp_dataset_serializer = NlpDatasetSerializer(nlp_dataset)
        try_tokenize(nlp_dataset=nlp_dataset)

        return Response(
            nlp_dataset_serializer.data,
            status=status.HTTP_200_OK
        )
        
    elif filename.endswith('.json'):
        if (content == None): # If not read at the unzip stage
            content = json.load(f)
        else: # If read at the unzip stage then convert
            content = json.loads(content)
        nlp_dataset_serializer = NlpDatasetSerializer(data=content)
        if (nlp_dataset_serializer.is_valid()):
            nlp_dataset = NlpDataset.objects.create(
                token_pattern_to_remove=nlp_dataset_serializer.validated_data['token_pattern_to_remove'],
                token_pattern_to_split=nlp_dataset_serializer.validated_data['token_pattern_to_split']
            )

            ner_labels_data = content.pop('ner_labels')
            old_new_ner_label_dict = {}
            for ner_label_data in ner_labels_data:
                ner_label_data.pop('nlp_dataset', None)
                old_ner_label_id = ner_label_data.pop('id', None)
                ner_label_serializer = NerLabelSerializer(data=ner_label_data)
                if (ner_label_serializer.is_valid()):
                    ner_label = NerLabel.objects.create(
                        name=ner_label_serializer.validated_data['name'],
                        color=ner_label_serializer.validated_data['color'],
                        nlp_dataset=nlp_dataset
                    )
                    old_new_ner_label_dict[old_ner_label_id] = ner_label
                else:
                    return Response(
                        ner_label_serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST
                    )

            nlp_texts_data = content.pop('nlp_texts')
            for nlp_text_data in nlp_texts_data:
                nlp_text_data.pop('id', None)
                nlp_text_data.pop('nlp_dataset', None)
                nlp_text_serializer = NlpTextSerializer(data=nlp_text_data)
                if (nlp_text_serializer.is_valid()):
                    nlp_text = NlpText.objects.create(
                        text=nlp_text_serializer.validated_data['text'],
                        classification_label=nlp_text_serializer.validated_data['classification_label'],
                        summarization=nlp_text_serializer.validated_data['summarization'],
                        nlp_dataset=nlp_dataset
                    )

                    nlp_tokens_data = nlp_text_data.pop('nlp_tokens')
                    for nlp_token_data in nlp_tokens_data:
                        nlp_token_data.pop('id', None)
                        nlp_token_data.pop('nlp_text', None)
                        nlp_token_serializer = NlpTokenSerializer(data=nlp_token_data)
                        if (nlp_token_serializer.is_valid()):
                            nlp_token = NlpToken.objects.create(
                                token=nlp_token_serializer.validated_data['token'],
                                pos=nlp_token_serializer.validated_data['pos'],
                                nlp_text=nlp_text
                            )
                            
                            nlp_token_ner_label_data = nlp_token_data.pop('nlp_token_ner_label', None)
                            old_nlp_token_ner_label_ner_label_id = nlp_token_ner_label_data.pop('ner_label', None)
                            nlp_token_ner_label_data.pop('nlp_token', None) # remove old nlp_token
                            nlp_token_ner_label_serializer = NlpTokenNerLabelSerializer(data=nlp_token_ner_label_data)
                            if (nlp_token_ner_label_serializer.is_valid()):
                                if (old_nlp_token_ner_label_ner_label_id != None):
                                    NlpTokenNerLabel.objects.create(
                                        initial=nlp_token_ner_label_serializer.validated_data['initial'],
                                        nlp_token=nlp_token, 
                                        ner_label=old_new_ner_label_dict.get(old_nlp_token_ner_label_ner_label_id),
                                    )
                            else:
                                return Response(
                                    nlp_token_ner_label_serializer.errors,
                                    status=status.HTTP_400_BAD_REQUEST
                                )
                        else:
                            return Response(
                                nlp_token_serializer.errors,
                                status=status.HTTP_400_BAD_REQUEST
                            )
                else:
                    return Response(
                        nlp_text_serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            nlp_dataset_serializer = NlpDatasetSerializer(nlp_dataset)

            return Response(
                nlp_dataset_serializer.data,
                status=status.HTTP_200_OK
            )

        return Response(
            nlp_dataset_serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

def try_tokenize(nlp_dataset):
    if nlp_dataset.token_pattern_to_split:
        nlp_texts = NlpText.objects.filter(nlp_dataset=nlp_dataset)

        if nlp_texts:
            for nlp_text in nlp_texts:
                # clear old tokens
                tokens = NlpToken.objects.filter(nlp_text=nlp_text)
                tokens.delete()

                text = nlp_text.text
                if nlp_dataset.token_pattern_to_remove:
                    text = re.sub(nlp_dataset.token_pattern_to_remove, '', text)
                tokens = re.split(nlp_dataset.token_pattern_to_split, text)
                pos = 0
                for token in tokens:
                    NlpToken.objects.get_or_create(token=token, pos=pos, nlp_text=nlp_text)
                    pos += 1
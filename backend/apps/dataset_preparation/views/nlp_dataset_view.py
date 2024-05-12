from io import BytesIO
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.renderers import JSONRenderer
import re
import json
import zipfile
from pathlib import Path

from apps.common.models import NerLabel, NlpDataset, NlpText, NlpToken, NlpTokenNerLabel
from apps.common.serializers import NerLabelSerializer, NlpDatasetFullSerializer, NlpDatasetSerializer, NlpTextSerializer, NlpTokenNerLabelSerializer, NlpTokenSerializer

from ..serializers import LoadingDataSerializer

class NlpDatasetView(APIView):
    def post(self, request, pk=None):
        """
        if json file then get nlp_dataset
        if txt file then add data to nlp_dataset (if not exists create nlp_dataset) and try tokenize 
        """
        loading_data_serializer = LoadingDataSerializer(data=request.data)
        if loading_data_serializer.is_valid():
            file = loading_data_serializer.validated_data['file']
            f = file.open('r')
            content = None

            if (file.name.endswith('.zip')):
                zip_file = zipfile.ZipFile(file)
                unpacked_file = zip_file.namelist()[0]
                content = zip_file.read(unpacked_file).decode("utf-8") # Reading file content
                file.name = Path(file.name).stem # remove the .zip extension and leave the original file extension

            if file.name.endswith('.txt'):
                text_pattern_to_split = loading_data_serializer.validated_data.get('text_pattern_to_split', None)
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
                self.try_tokenize(nlp_dataset=nlp_dataset)

                return Response(
                    nlp_dataset_serializer.data,
                    status=status.HTTP_200_OK
                )
                
            elif file.name.endswith('.json'):
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
        
        return Response(
            loading_data_serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def put(self, request, pk):
        """
        update nlp_dataset and try tokenize
        """
        nlp_dataset = NlpDataset.objects.get(pk=pk)
        nlp_dataset_serializer = NlpDatasetSerializer(instance=nlp_dataset, data=request.data)

        if nlp_dataset_serializer.is_valid():
            nlp_dataset_serializer.save()
            self.try_tokenize(nlp_dataset=nlp_dataset)
            
            return Response(
                nlp_dataset_serializer.data,
                status=status.HTTP_200_OK
            )
        
        return Response(
            nlp_dataset_serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
    def get(self, request, pk=None):
        """
        get nlp_datasets
        """
        if pk:
            nlp_dataset = get_object_or_404(NlpDataset, pk=pk)
        
            if nlp_dataset:
                nlp_dataset_serializer = NlpDatasetSerializer(nlp_dataset)
                return Response(
                    nlp_dataset_serializer.data,
                    status=status.HTTP_200_OK
                )
                
        elif pk == None:
            if request.query_params:
                nlp_datasets = NlpDataset.objects.filter(**request.query_params.dict())
            else:
                nlp_datasets = NlpDataset.objects.all()
        
            if nlp_datasets:
                nlp_dataset_serializer = NlpDatasetSerializer(nlp_datasets, many=True)
                return Response(
                    nlp_dataset_serializer.data,
                    status=status.HTTP_200_OK
                )
        return Response("Nlp datasets not found", status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        """
        delete nlp_dataset
        """
        nlp_dataset = get_object_or_404(NlpDataset, pk=pk)
        nlp_dataset.delete()
        return Response(status=status.HTTP_202_ACCEPTED)

    def try_tokenize(self, nlp_dataset):
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

@api_view(['GET'])
def download_nlp_dataset(request, pk):
    if pk:
        nlp_dataset = get_object_or_404(NlpDataset, pk=pk)
    
        if nlp_dataset:
            nlp_dataset_serializer = NlpDatasetFullSerializer(nlp_dataset)
            json_data = JSONRenderer().render(nlp_dataset_serializer.data)
            return Response(
                json_data,
                content_type='application/octet-stream',
                headers={
                    'Content-Disposition': "attachment; filename=dataset.json"
                },
                status=status.HTTP_200_OK
            )
        
    return Response("Nlp datasets not found", status=status.HTTP_400_BAD_REQUEST)
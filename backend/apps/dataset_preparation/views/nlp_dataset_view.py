from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
import re
import json

from apps.common.models import NlpDataset, NlpText, NlpToken
from apps.common.serializers import NlpDatasetSerializer

from ..serializers import LoadingDataSerializer

class NlpDatasetView(APIView):
    def post(self, request, pk = None):
        """
        if json file then get nlp_dataset
        if txt file then add data to nlp_dataset (if not exists create nlp_dataset) and try tokenize 
        """
        loading_data_serializer = LoadingDataSerializer(data=request.data)
        if loading_data_serializer.is_valid():
            file = loading_data_serializer.validated_data['file']
            f = file.open('r')

            if file.name.endswith('.txt'):
                text_pattern_to_split = loading_data_serializer.validated_data.get('text_pattern_to_split', None)
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
                data = json.load(f)

                return Response(
                    data,
                    status=status.HTTP_200_OK
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
    
    def get(self, request):
        """
        get nlp_datasets
        """
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
                    text = nlp_text.text
                    if nlp_dataset.token_pattern_to_remove:
                        text = re.sub(nlp_dataset.token_pattern_to_remove, '', text)
                    tokens = re.split(nlp_dataset.token_pattern_to_split, text)
                    pos = 0
                    for token in tokens:
                        NlpToken.objects.get_or_create(token=token, pos=pos, text=nlp_text)
                        pos += 1
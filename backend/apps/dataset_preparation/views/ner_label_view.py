from django.shortcuts import get_object_or_404
from rest_framework import serializers
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.common.models import NerLabel
from apps.common.serializers import NerLabelSerializer

class NerLabelView(APIView):
    def get(self, request, nlp_dataset_pk=None):
        """
        get ner_labels
        """
        if nlp_dataset_pk:
            ner_labels = NerLabel.objects.filter(nlp_dataset=nlp_dataset_pk)
        else:
            if request.query_params:
                ner_labels = NerLabel.objects.filter(**request.query_params.dict())
            else:
                ner_labels = NerLabel.objects.all()
        
        if ner_labels:
            ner_label_serializer = NerLabelSerializer(ner_labels, many=True)
            return Response(
                ner_label_serializer.data,
                status=status.HTTP_200_OK
            )
        return Response("Ner labels not found", status=status.HTTP_400_BAD_REQUEST)
    
    def post(self, request, nlp_dataset_pk):
        """
        post ner_label
        """
        request.data['nlp_dataset'] = nlp_dataset_pk
        ner_label_serializer = NerLabelSerializer(data=request.data)

        if NerLabel.objects.filter(**request.data).exists():
            raise serializers.ValidationError('NerLabel already exists')
        
        if ner_label_serializer.is_valid():
            ner_label_serializer.save()
            return Response(ner_label_serializer.data)
        else:
            return Response(
                ner_label_serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

    def put(self, request, pk):
        """
        update ner_label
        """
        ner_label = NerLabel.objects.get(pk=pk)
        ner_label_serializer = NerLabelSerializer(instance=ner_label, data=request.data)
    
        if ner_label_serializer.is_valid():
            ner_label_serializer.save()
            return Response(ner_label_serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(ner_label_serializer.errors, status=status.HTTP_404_NOT_FOUND)
        
    def delete(self, request, pk):
        """
        delete ner_label
        """
        ner_label = get_object_or_404(NerLabel, pk=pk)
        ner_label.delete()
        return Response(status=status.HTTP_202_ACCEPTED)
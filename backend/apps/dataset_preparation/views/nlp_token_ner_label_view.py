from django.shortcuts import get_object_or_404
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.common.models import NlpTokenNerLabel
from apps.common.serializers import NlpTokenNerLabelSerializer

class NlpTokenNerLabelView(APIView):
    def get(self, request, nlp_token_pk=None):
        """
        get nlp_token_ner_label
        """
        if nlp_token_pk:
            nlp_token_ner_label = get_object_or_404(NlpTokenNerLabel, nlp_token=nlp_token_pk)

            if nlp_token_ner_label:
                nlp_token_ner_label_serializer = NlpTokenNerLabelSerializer(nlp_token_ner_label)
                return Response(
                    nlp_token_ner_label_serializer.data,
                    status=status.HTTP_200_OK
                )
        else:
            if request.query_params:
                nlp_token_ner_labels = NlpTokenNerLabel.objects.filter(**request.query_params.dict())
            else:
                nlp_token_ner_labels = NlpTokenNerLabel.objects.all()
    
            if nlp_token_ner_labels:
                nlp_token_ner_label_serializer = NlpTokenNerLabelSerializer(nlp_token_ner_labels, many=True)
                return Response(
                    nlp_token_ner_label_serializer.data,
                    status=status.HTTP_200_OK
                )
        
        return Response("NlpTokenNerLabels not found", status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, nlp_token_pk):
        """
        post nlp_token_ner_label
        """
        if NlpTokenNerLabel.objects.filter(nlp_token=nlp_token_pk).exists():
            raise serializers.ValidationError('NlpTokenNerLabel already exists')

        request.data['nlp_token'] = nlp_token_pk
        
        nlp_token_ner_label_serializer = NlpTokenNerLabelSerializer(data=request.data)
        
        if nlp_token_ner_label_serializer.is_valid():
            nlp_token_ner_label_serializer.save()
            return Response(nlp_token_ner_label_serializer.data)
        else:
            return Response(
                nlp_token_ner_label_serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

    def put(self, request, nlp_token_pk):
        """
        update nlp_token_ner_label
        """
        nlp_token_ner_label = NlpTokenNerLabel.objects.get(nlp_token=nlp_token_pk)
        nlp_token_ner_label_serializer = NlpTokenNerLabelSerializer(instance=nlp_token_ner_label, data=request.data)
        
        if nlp_token_ner_label_serializer.is_valid():
            nlp_token_ner_label_serializer.save()
            return Response(nlp_token_ner_label_serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(nlp_token_ner_label_serializer.errors, status=status.HTTP_404_NOT_FOUND)
        
    def delete(self, request, nlp_token_pk):
        """
        delete nlp_token_ner_label
        """
        nlp_token_ner_label = get_object_or_404(NlpTokenNerLabel, nlp_token=nlp_token_pk)
        nlp_token_ner_label.delete()
        return Response(status=status.HTTP_202_ACCEPTED)
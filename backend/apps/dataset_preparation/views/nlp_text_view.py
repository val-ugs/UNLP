from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.common.models import NlpText
from apps.common.serializers import NlpTextSerializer

class NlpTextView(APIView):
    def get(self, request, pk=None, nlp_dataset_pk=None):
        """
        get nlp_texts
        """
        if pk:
            nlp_text = get_object_or_404(NlpText, pk=pk)
        
            if nlp_text:
                nlp_text_serializer = NlpTextSerializer(nlp_text)
                return Response(
                    nlp_text_serializer.data,
                    status=status.HTTP_200_OK
                )
                
        elif pk == None:
            if nlp_dataset_pk:
                nlp_texts = NlpText.objects.filter(nlp_dataset=nlp_dataset_pk)
            else:
                if request.query_params:
                    nlp_texts = NlpText.objects.filter(**request.query_params.dict())
                else:
                    nlp_texts = NlpText.objects.all()
        
            if nlp_texts:
                nlp_text_serializer = NlpTextSerializer(nlp_texts, many=True)
                return Response(
                    nlp_text_serializer.data,
                    status=status.HTTP_200_OK
                )
            
        return Response("Nlp texts not found", status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        """
        update nlp_text
        """
        nlp_text = NlpText.objects.get(pk=pk)
        nlp_text_serializer = NlpTextSerializer(instance=nlp_text, data=request.data)
    
        if nlp_text_serializer.is_valid():
            nlp_text_serializer.save()
            return Response(nlp_text_serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(nlp_text_serializer.errors, status=status.HTTP_404_NOT_FOUND)
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.common.models import NlpToken
from apps.common.serializers import NlpTokenSerializer

class NlpTokenView(APIView):
    def get(self, request, pk=None, nlp_text_pk=None):
        """
        get nlp_tokens
        """
        if pk:
            nlp_token = get_object_or_404(NlpToken, pk=pk)
        
            if nlp_token:
                nlp_token_serializer = NlpTokenSerializer(nlp_token)
                return Response(
                    nlp_token_serializer.data,
                    status=status.HTTP_200_OK
                )
        
        elif pk == None:
            if nlp_text_pk:
                nlp_tokens = NlpToken.objects.filter(nlp_text=nlp_text_pk)
            else:
                if request.query_params:
                    nlp_tokens = NlpToken.objects.filter(**request.query_params.dict())
                else:
                    nlp_tokens = NlpToken.objects.all()
        
            if nlp_tokens:
                nlp_token_serializer = NlpTokenSerializer(nlp_tokens, many=True)
                return Response(
                    nlp_token_serializer.data,
                    status=status.HTTP_200_OK
                )
        
        return Response("Nlp tokens not found", status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        """
        update nlp_token
        """
        nlp_token = NlpToken.objects.get(pk=pk)
        nlp_token_serializer = NlpTokenSerializer(instance=nlp_token, data=request.data)
    
        if nlp_token_serializer.is_valid():
            nlp_token_serializer.save()
            return Response(nlp_token_serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(nlp_token_serializer.errors, status=status.HTTP_404_NOT_FOUND)
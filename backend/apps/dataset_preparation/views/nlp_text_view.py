from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.common.models import NlpText
from apps.common.serializers import NlpTextSerializer

class NlpTextView(APIView):
    def get(self, request):
        """
        get nlp_texts
        """
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

    def put(request, pk):
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
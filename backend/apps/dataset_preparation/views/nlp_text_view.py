from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from apps.common.models import NlpText
from apps.common.serializers import NlpTextSerializer

@api_view(['PUT'])  
def update(request, pk):
    item = NlpText.objects.get(pk=pk)
    nlp_text_serializer = NlpTextSerializer(instance=item, data=request.data)
 
    if nlp_text_serializer.is_valid():
        nlp_text_serializer.save()
        return Response(nlp_text_serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(nlp_text_serializer.errors, status=status.HTTP_404_NOT_FOUND)
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.common.models import NerLabel
from apps.common.serializers import NerLabelSerializer

class NerLabelView(APIView):
    def get(self, request):
        """
        get ner_labels
        """
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
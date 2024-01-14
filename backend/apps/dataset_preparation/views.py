from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
import re
import json

from apps.nlp.models import NlpText
from apps.nlp.serializers import NlpTextSerializer

from .serializers import FileUploadSerializer


class GetNlpTextsView(APIView):
    def post(self, request):
        file_upload_serializer = FileUploadSerializer(data=request.data)
        if file_upload_serializer.is_valid():
            #serializer.save()
            
            file = file_upload_serializer.validated_data['file']
            f = file.open('r')

            if file.name.endswith('.txt'):
                pattern = file_upload_serializer.validated_data.get('pattern', None)
                
                content = f.read().decode()
                
                if pattern != None:
                    texts = re.split(pattern, content)
                    
                    nlp_texts = [NlpText.objects.create(text=text.strip(), title='') for text in texts]
                    nlp_text_serializer = NlpTextSerializer(nlp_texts, many=True)
                    
                    return Response(
                        {'data': nlp_text_serializer.data},
                        status=status.HTTP_200_OK
                    )
                else:
                    nlp_text = NlpText.objects.create(text=content, title='')
                    nlp_text_serializer = NlpTextSerializer(nlp_text)

                    return Response(
                        {'data': nlp_text_serializer.data},
                        status=status.HTTP_200_OK
                    )
            else:
                data = json.load(f)

                return Response(
                        data,
                        status=status.HTTP_200_OK
                    )
                
        
        return Response(
            file_upload_serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
import re
import json

from apps.common.models import NlpText, NlpToken
from apps.common.serializers import NlpTextSerializer

from .serializers import FileUploadSerializer


@api_view(['GET']) 
def get_nlp_texts(request):
    file_upload_serializer = FileUploadSerializer(data=request.data)
    if file_upload_serializer.is_valid():
        file = file_upload_serializer.validated_data['file']
        f = file.open('r')

        if file.name.endswith('.txt'):
            pattern = file_upload_serializer.validated_data.get('pattern', None)
            content = f.read().decode()
            
            if pattern:
                # split text based on pattern
                texts = re.split(pattern, content)
                
                nlp_texts = [NlpText.objects.create(text=text.strip()) for text in texts]
                nlp_text_serializer = NlpTextSerializer(nlp_texts, many=True)
                
                return Response(
                    {'data': nlp_text_serializer.data},
                    status=status.HTTP_200_OK
                )
            else:
                nlp_text = NlpText.objects.create(text=content)
                nlp_text_serializer = NlpTextSerializer(nlp_text)

                return Response(
                    {'data': nlp_text_serializer.data},
                    status=status.HTTP_200_OK
                )
        elif file.name.endswith('.json'):
            data = json.load(f)

            return Response(
                data,
                status=status.HTTP_200_OK
            )
            
    
    return Response(
        file_upload_serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(['POST'])  
def save_nlp_texts(request):
    nlp_text_serializer = NlpTextSerializer(data=request.data['data'], many=True)
    if (nlp_text_serializer.is_valid()):
        nlp_text_serializer.save()

        return Response(
            nlp_text_serializer.data,
            status=status.HTTP_200_OK
        )

    return Response(
        nlp_text_serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(['POST'])  
def tokenize_nlp_texts(request):
    remove_pattern = request.data['remove_pattern']
    split_pattern = request.data['split_pattern']

    if split_pattern:
        nlp_text_id_list = [nlp_text['id'] for nlp_text in request.data['data']]
        nlp_texts = NlpText.objects.filter(id__in=nlp_text_id_list)

        if nlp_texts:
            for nlp_text in nlp_texts:
                text = nlp_text.text
                if remove_pattern:
                    text = re.sub(remove_pattern, '', text)
                tokens = re.split(split_pattern, text)
                pos = 0
                for token in tokens:
                    NlpToken.objects.get_or_create(token=token, pos=pos, text=nlp_text)
                    pos += 1

            nlp_text_serializer = NlpTextSerializer(nlp_texts, many=True)
            
            return Response(
                nlp_text_serializer.data,
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                "NlpTexts not found",
                status=status.HTTP_400_BAD_REQUEST
            )
    
    return Response(
        "Tokenization pattern not specified",
        status=status.HTTP_400_BAD_REQUEST
    )
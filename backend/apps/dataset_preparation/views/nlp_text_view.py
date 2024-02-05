from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from apps.common.enums import Sort

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
            search = request.GET.get('search')
            sort = request.GET.get('sort')

            if nlp_dataset_pk:
                if search: 
                    if (sort == Sort.ASC.value or sort == Sort.DESC.value):
                        nlp_texts = NlpText.objects.filter(nlp_dataset=nlp_dataset_pk).filter(text__contains=search).order_by(f"{'' if sort == Sort.ASC.value else '-' }text")
                    else:
                        nlp_texts = NlpText.objects.filter(nlp_dataset=nlp_dataset_pk).filter(text__contains=search).order_by('id')
                else:
                    if (sort == Sort.ASC.value or sort == Sort.DESC.value):
                        nlp_texts = NlpText.objects.filter(nlp_dataset=nlp_dataset_pk).order_by(f"{'' if sort == Sort.ASC.value else '-' }text")
                    else:
                        nlp_texts = NlpText.objects.filter(nlp_dataset=nlp_dataset_pk).order_by('id')
            else:
                if search:
                    if (sort == Sort.ASC.value or sort == Sort.DESC.value):
                        nlp_texts = NlpText.objects.filter(text__contains=search).order_by(f"{'' if sort == Sort.ASC.value else '-' }text")
                    else:
                        nlp_texts = NlpText.objects.filter(text__contains=search).order_by('id')
                else:
                    if (sort == Sort.ASC.value or sort == Sort.DESC.value):
                        nlp_texts = NlpText.objects.order_by(f"{'' if sort == Sort.ASC.value else '-' }text")
                    else:
                        nlp_texts = NlpText.objects.all().order_by('id')
                
            page_size = request.GET.get('page_size', nlp_texts.count())
            paginator = PageNumberPagination()
            paginator.page_size = page_size
            nlp_texts_page = paginator.paginate_queryset(nlp_texts, request)
            if nlp_texts_page:
                nlp_text_serializer = NlpTextSerializer(nlp_texts_page, many=True)
                return paginator.get_paginated_response(nlp_text_serializer.data)
            
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
        
    def delete(self, request, pk):
        """
        delete nlp_text
        """
        nlp_dataset = get_object_or_404(NlpText, pk=pk)
        nlp_dataset.delete()
        return Response(status=status.HTTP_202_ACCEPTED)
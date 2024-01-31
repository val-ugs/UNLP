from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from apps.nlp.serializers import PredictorSerializer, TrainerSerializer

@api_view(['POST'])
def classification_model_train(request):
    data = request.data
    data['type'] = 'Classification'
    train_serializer = TrainerSerializer(data=data)
    if train_serializer.is_valid():
        # train classification algorithm and save
        return Response(train_serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(train_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def classification_model_predict(request):
    data = request.data
    data['type'] = 'Classification'
    predictor_serializer = PredictorSerializer(data=data)
    if predictor_serializer.is_valid():
        # predict
        return Response(predictor_serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(predictor_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
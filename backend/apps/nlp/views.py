from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import ClassificationModel, NerModel
from .serializers import ClassificationModelSerializer, ClassificationModelTrainSerializer, ClassificationModelPredictSerializer, NerModelSerializer, NerModelTrainSerializer, NerModelPredictSerializer

@api_view(['GET'])
def get_classification_models(request):
    classification_models = ClassificationModel.objects.all()
    serializer = ClassificationModelSerializer(classification_models, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def classification_model_train(request):
    data = request.data
    serializer = ClassificationModelTrainSerializer(data=data)
    if serializer.is_valid():
        # train classification algorithm and save
        return Response("ok")
    else:
        return Response(serializer.errors, status=400)
    
@api_view(['POST'])
def classification_model_predict(request):
    data = request.data
    serializer = ClassificationModelPredictSerializer(data=data)
    if serializer.is_valid():
        # predict
        return Response("ok")
    else:
        return Response(serializer.errors, status=400)

@api_view(['GET'])
def get_ner_models(request):
    ner_models = NerModel.objects.all()
    serializer = NerModelSerializer(ner_models, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def ner_model_train(request):
    data = request.data
    serializer = NerModelTrainSerializer(data=data)
    if serializer.is_valid():
        # train classification algorithm and save
        return Response("ok")
    else:
        return Response(serializer.errors, status=400)
    
@api_view(['POST'])
def ner_model_predict(request):
    data = request.data
    serializer = NerModelPredictSerializer(data=data)
    if serializer.is_valid():
        # predict
        return Response("ok")
    else:
        return Response(serializer.errors, status=400)
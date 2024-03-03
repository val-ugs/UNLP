import json
from django.shortcuts import get_object_or_404
from rest_framework import serializers, status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from apps.common.models import NlpDataset
from apps.nlp.models import HuggingFaceModel, TrainingArgs
from apps.nlp.serializers import HuggingFaceModelSerializer, TrainingArgsSerializer
from apps.nlp.trainer.CommonTrainer import CommonTrainer

class HuggingFaceModelView(APIView):
    def post(self, request, pk=None):
        """
        add hugging_face_model
        """
        if HuggingFaceModel.objects.filter(pk=pk).exists():
            raise serializers.ValidationError('HuggingFaceModel already exists')
        
        data = request.data
        training_args_data = data.pop('training_args')
        hugging_face_model_serializer = HuggingFaceModelSerializer(data=data)
        
        if hugging_face_model_serializer.is_valid():
            hugging_face_model = hugging_face_model_serializer.save()

            training_args_serializer = TrainingArgsSerializer(data=training_args_data)
            if training_args_serializer.is_valid():
                TrainingArgs.objects.create(
                    hugging_face_model=hugging_face_model,
                    **training_args_serializer.validated_data
                )
            else:
                return Response(
                    training_args_serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )

            return Response(hugging_face_model_serializer.data)
        else:
            return Response(
                hugging_face_model_serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        
    def put(self, request, pk):
        """
        update hugging_face_model
        """
        data = request.data
        training_args_data = data.pop('training_args')
        hugging_face_model = HuggingFaceModel.objects.get(pk=pk)
        hugging_face_model_serializer = HuggingFaceModelSerializer(instance=hugging_face_model, data=data)

        if hugging_face_model_serializer.is_valid():
            hugging_face_model_serializer.save()

            training_args = TrainingArgs.objects.get(hugging_face_model=hugging_face_model)
            training_args_serializer = TrainingArgsSerializer(instance=training_args, data=training_args_data)
            if training_args_serializer.is_valid():
                training_args_serializer.save()
            else:
                return Response(
                    training_args_serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            return Response(
                hugging_face_model_serializer.data,
                status=status.HTTP_200_OK
            )
        
        return Response(
            hugging_face_model_serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
    def get(self, request, pk=None):
        """
        get hugging_face_models
        """
        if pk:
            hugging_face_model = get_object_or_404(HuggingFaceModel, pk=pk)
        
            if hugging_face_model:
                hugging_face_model_serializer = HuggingFaceModelSerializer(hugging_face_model)
                return Response(
                    hugging_face_model_serializer.data,
                    status=status.HTTP_200_OK
                )
                
        elif pk == None:
            if request.query_params:
                hugging_face_models = HuggingFaceModel.objects.filter(**request.query_params.dict())
            else:
                hugging_face_models = HuggingFaceModel.objects.all()
        
            if hugging_face_models:
                hugging_face_model_serializer = HuggingFaceModelSerializer(hugging_face_models, many=True)
                return Response(
                    hugging_face_model_serializer.data,
                    status=status.HTTP_200_OK
                )
        return Response("Hugging face models not found", status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        """
        delete hugging_face_model
        """
        hugging_face_model = get_object_or_404(HuggingFaceModel, pk=pk)
        hugging_face_model.delete()
        return Response(status=status.HTTP_202_ACCEPTED)

@api_view(['GET'])
def train(request, hugging_face_model_pk):
    hugging_face_model = get_object_or_404(HuggingFaceModel, pk=hugging_face_model_pk)
    trainer = CommonTrainer(hugging_face_model)

    log_history = trainer.train()

    return Response(log_history, status=status.HTTP_200_OK)
    
@api_view(['GET'])
def predict(request, hugging_face_model_pk, nlp_dataset_pk):
    hugging_face_model = get_object_or_404(HuggingFaceModel, pk=hugging_face_model_pk)
    try:
        trainer = CommonTrainer(hugging_face_model)

        test_nlp_dataset = get_object_or_404(NlpDataset, pk=nlp_dataset_pk)
        trainer.predict(test_nlp_dataset)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    return Response(status=status.HTTP_200_OK)
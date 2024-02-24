from django.shortcuts import get_object_or_404
from rest_framework import serializers, status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from apps.common.models import NlpDataset
from apps.nlp.models import HuggingFaceModel, ModelType, TrainingArgs
from apps.nlp.serializers import HuggingFaceModelSerializer, TrainingArgsSerializer
from apps.nlp.trainers.ClassificationTrainer import ClassificationTrainer
from apps.nlp.trainers.NerTrainer import NerTrainer

import evaluate
import os

from apps.nlp.utils.convert_nlp_dataset_to_df import convert_nlp_dataset_to_df
from apps.nlp.utils.convert_training_args_to_training_arguments import convert_training_args_to_training_arguments
from apps.nlp.utils.split_df import split_df

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

NLP_FOLDER_NAME = "trained_models"

@api_view(['GET'])
def train(request, hugging_face_model_pk):
    trainer = get_trainer(hugging_face_model_pk)

    trainer.train()

    return Response(status=status.HTTP_200_OK)
    
@api_view(['GET'])
def predict(request, hugging_face_model_pk, nlp_dataset_pk):
    trainer = get_trainer(hugging_face_model_pk)

    test_nlp_dataset = get_object_or_404(NlpDataset, pk=nlp_dataset_pk)
    test_df = convert_nlp_dataset_to_df(test_nlp_dataset)

    trainer.predict(test_df)

    return Response(status=status.HTTP_200_OK)
#     predictor_serializer = PredictorSerializer(data=data)
#     if predictor_serializer.is_valid():
#         # predict
#         return Response(predictor_serializer.data, status=status.HTTP_200_OK)
#     else:
#         return Response(predictor_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def get_trainer(hugging_face_model_pk):
    hugging_face_model = get_object_or_404(HuggingFaceModel, pk=hugging_face_model_pk)
    output_dir=f"{NLP_FOLDER_NAME}\{hugging_face_model.type}\{hugging_face_model.train_nlp_dataset.pk}"

    # if trained model exist - take it
    if os.path.exists(output_dir):
        hugging_face_model.model_name_or_path = output_dir

    training_args = get_object_or_404(TrainingArgs, hugging_face_model=hugging_face_model)
    training_arguments = convert_training_args_to_training_arguments(output_dir, training_args)
    df = convert_nlp_dataset_to_df(hugging_face_model.train_nlp_dataset)
    train_df, valid_df = split_df(df, 0.8) # TODO: move coefficient to parameter
    evaluate_metric_name = 'accuracy' # classification # TODO: move to parameter
    # evaluate_metric_name = 'seqeval' # ner
    metric = evaluate.load(evaluate_metric_name)

    trainer = None
    match hugging_face_model.type:
        case ModelType.CLASSIFICATION:
            trainer = ClassificationTrainer(
                model_name_or_path=hugging_face_model.model_name_or_path,
                training_args=training_arguments,
                metric=metric,
                train_df=train_df,
                val_df=valid_df,
                output_dir=output_dir
            )
        case ModelType.NER:
            trainer = NerTrainer(
                model_name_or_path=hugging_face_model.model_name_or_path,
                training_args=training_arguments,
                metric=metric,
                train_df=train_df,
                val_df=valid_df,
                output_dir=output_dir
            )

    return trainer
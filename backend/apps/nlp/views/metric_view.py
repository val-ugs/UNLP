from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response

import evaluate

from apps.common.models import NlpDataset, NlpText
from apps.nlp.utils.convert_nlp_dataset_to_df import convert_nlp_dataset_to_df
from apps.nlp.utils.get_id2label_label2id import get_id2label_label2id

@api_view(['GET'])
def calculate_classification_metric(request):
    try:
        nlp_dataset_pk = request.GET.get('nlp_dataset_pk', '')
        predicted_nlp_dataset_pk = request.GET.get('predicted_nlp_dataset_pk', '')
        metric_name = request.GET.get('metric_name', '')
        average = request.GET.get('average', '')

        nlp_dataset = get_object_or_404(NlpDataset, pk=nlp_dataset_pk)
        df = convert_nlp_dataset_to_df(nlp_dataset)
        _, label2id = get_id2label_label2id(df["labels"].tolist())

        nlp_texts = NlpText.objects.filter(nlp_dataset=nlp_dataset_pk)
        predicted_nlp_texts = NlpText.objects.filter(nlp_dataset=predicted_nlp_dataset_pk)
        classification_labels = [label2id[nlp_text.classification_label] for nlp_text in nlp_texts]
        predicted_classification_labels = [label2id[nlp_text.classification_label] for nlp_text in predicted_nlp_texts]

        if (len(classification_labels) != len(predicted_classification_labels)):
            raise Exception('The number of classification labels (nlp texts) in the selected datasets does not match')

        results = None
        match metric_name:
            case 'accuracy':
                metric = evaluate.load(metric_name)
                results = metric.compute(references=classification_labels, predictions=predicted_classification_labels)
            case 'f1':
                metric = evaluate.load(metric_name)
                results = metric.compute(references=classification_labels, predictions=predicted_classification_labels, average=average)
            case _:
                raise Exception('Metric not found')
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    return Response(results, status=status.HTTP_200_OK)

@api_view(['GET'])
def calculate_ner_metric(request):
    try:
        nlp_dataset_pk = request.GET.get('nlp_dataset_pk', '')
        predicted_nlp_dataset_pk = request.GET.get('predicted_nlp_dataset_pk', '')
        metric_name = request.GET.get('metric_name', '')

        nlp_dataset = get_object_or_404(NlpDataset, pk=nlp_dataset_pk)
        df = convert_nlp_dataset_to_df(nlp_dataset)

        predicted_nlp_dataset = get_object_or_404(NlpDataset, pk=predicted_nlp_dataset_pk)
        predicted_df = convert_nlp_dataset_to_df(predicted_nlp_dataset)
        
        ner_labels = df["tags"].tolist()
        predicted_ner_labels = predicted_df["tags"].tolist()

        # if (len(classification_labels) != len(predicted_classification_labels)):
        #     raise Exception('The number of classification labels (nlp texts) in the selected datasets does not match')

        metric = evaluate.load(metric_name)
        results = metric.compute(references=ner_labels, predictions=predicted_ner_labels)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    return Response(results, status=status.HTTP_200_OK)

@api_view(['GET'])
def calculate_summarization_metric(request):
    try:
        nlp_dataset_pk = request.GET.get('nlp_dataset_pk', '')
        predicted_nlp_dataset_pk = request.GET.get('predicted_nlp_dataset_pk', '')
        metric_name = request.GET.get('metric_name', '')

        nlp_texts = NlpText.objects.filter(nlp_dataset=nlp_dataset_pk)
        predicted_nlp_texts = NlpText.objects.filter(nlp_dataset=predicted_nlp_dataset_pk)
        
        summarizations = [nlp_text.summarization for nlp_text in nlp_texts]
        predicted_summarizations = [nlp_text.summarization for nlp_text in predicted_nlp_texts]

        metric = evaluate.load(metric_name)
        results = metric.compute(references=summarizations, predictions=predicted_summarizations)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    return Response(results, status=status.HTTP_200_OK)

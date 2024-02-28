import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import { api } from './apiService';
import { tagTypes } from './tagTypes';
import {
  HuggingFaceModelProps,
  HuggingFaceModelType,
} from 'interfaces/huggingFaceModel.interface';

export const huggingFaceModelApi = api.injectEndpoints({
  endpoints: (build: EndpointBuilder<BaseQueryFn, string, string>) => ({
    getHugginsFaceModelById: build.query<HuggingFaceModelProps, number>({
      query: (id: number) => ({
        url: `/nlp/hugging-face-models/${id}/`,
      }),
      transformResponse: (response: any) => {
        return {
          id: response['id'],
          name: response['name'],
          modelNameOrPath: response['model_name_or_path'],
          trainNlpDataset: response['train_nlp_dataset'],
          validNlpDataset: response['valid_nlp_dataset'],
          evaluateMetricName: response['evaluate_metric_name'],
          type: response['type'],
          trainingArgs: response['training_args'],
        };
      },
      providesTags: () => [tagTypes.HuggingFaceModel],
    }),
    getHugginsFaceModelsByType: build.query<
      HuggingFaceModelProps[],
      HuggingFaceModelType
    >({
      query: (type: HuggingFaceModelType) => ({
        url: `/nlp/hugging-face-models/?type=${type}`,
      }),
      transformResponse: (response: any) => {
        return response.map((huggingFaceModel: any) => ({
          id: huggingFaceModel['id'],
          name: huggingFaceModel['name'],
          modelNameOrPath: huggingFaceModel['model_name_or_path'],
          trainNlpDataset: huggingFaceModel['train_nlp_dataset'],
          validNlpDataset: huggingFaceModel['valid_nlp_dataset'],
          evaluateMetricName: huggingFaceModel['evaluate_metric_name'],
          type: huggingFaceModel['type'],
          trainingArgs: {
            learningRate: huggingFaceModel['training_args']['learning_rate'],
            perDeviceTrainBatchSize:
              huggingFaceModel['training_args']['per_device_train_batch_size'],
            perDeviceEvalBatchSize:
              huggingFaceModel['training_args']['per_device_eval_batch_size'],
            numTrainEpochs:
              huggingFaceModel['training_args']['num_train_epochs'],
            weightDecay: huggingFaceModel['training_args']['weight_decay'],
            evaluationStrategy:
              huggingFaceModel['training_args']['evaluation_strategy'],
            saveStrategy: huggingFaceModel['training_args']['save_strategy'],
            loadBestModelAtEnd:
              huggingFaceModel['training_args']['load_best_model_at_end'],
          },
        }));
      },
      providesTags: () => [tagTypes.HuggingFaceModel],
    }),
    postHuggingFaceModel: build.mutation<void, HuggingFaceModelProps>({
      query: (huggingFaceModel) => ({
        url: `/nlp/hugging-face-models/`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: huggingFaceModel.name,
          model_name_or_path: huggingFaceModel.modelNameOrPath,
          train_nlp_dataset: huggingFaceModel.trainNlpDataset,
          valid_nlp_dataset: huggingFaceModel.validNlpDataset,
          evaluate_metric_name: huggingFaceModel.evaluateMetricName,
          type: huggingFaceModel.type,
          training_args: {
            learning_rate: huggingFaceModel.trainingArgs.learningRate,
            per_device_train_batch_size:
              huggingFaceModel.trainingArgs.perDeviceTrainBatchSize,
            per_device_eval_batch_size:
              huggingFaceModel.trainingArgs.perDeviceEvalBatchSize,
            num_train_epochs: huggingFaceModel.trainingArgs.numTrainEpochs,
            weight_decay: huggingFaceModel.trainingArgs.weightDecay,
            evaluation_strategy:
              huggingFaceModel.trainingArgs.evaluationStrategy,
            save_strategy: huggingFaceModel.trainingArgs.saveStrategy,
            load_best_model_at_end:
              huggingFaceModel.trainingArgs.loadBestModelAtEnd,
          },
        }),
      }),
      invalidatesTags: [tagTypes.HuggingFaceModel],
    }),
    putHuggingFaceModel: build.mutation<
      HuggingFaceModelProps,
      HuggingFaceModelProps
    >({
      query: ({ id, ...huggingFaceModel }) => ({
        url: `/nlp/hugging-face-models/${id}/`,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: huggingFaceModel.name,
          model_name_or_path: huggingFaceModel.modelNameOrPath,
          train_nlp_dataset: huggingFaceModel.trainNlpDataset,
          valid_nlp_dataset: huggingFaceModel.validNlpDataset,
          evaluate_metric_name: huggingFaceModel.evaluateMetricName,
          type: huggingFaceModel.type,
          training_args: {
            learning_rate: huggingFaceModel.trainingArgs.learningRate,
            per_device_train_batch_size:
              huggingFaceModel.trainingArgs.perDeviceTrainBatchSize,
            per_device_eval_batch_size:
              huggingFaceModel.trainingArgs.perDeviceEvalBatchSize,
            num_train_epochs: huggingFaceModel.trainingArgs.numTrainEpochs,
            weight_decay: huggingFaceModel.trainingArgs.weightDecay,
            evaluation_strategy:
              huggingFaceModel.trainingArgs.evaluationStrategy,
            save_strategy: huggingFaceModel.trainingArgs.saveStrategy,
            load_best_model_at_end:
              huggingFaceModel.trainingArgs.loadBestModelAtEnd,
          },
        }),
      }),
      invalidatesTags: [tagTypes.HuggingFaceModel],
    }),
    deleteHuggingFaceModel: build.mutation<void, number>({
      query: (id: number) => ({
        url: `/nlp/hugging-face-models/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.HuggingFaceModel],
    }),
    trainHuggingFaceModel: build.mutation<void, HuggingFaceModelProps>({
      query: (huggingFaceModel: HuggingFaceModelProps) => ({
        url: `/nlp/hugging-face-models/${huggingFaceModel.id}/train`,
        method: 'GET',
      }),
    }),
    predictHuggingFaceModel: build.mutation<void, any>({
      query: ({ huggingFaceModel, testNlpDatasetId }) => ({
        url: `/nlp/hugging-face-models/${huggingFaceModel.id}/predict/nlp-datasets/${testNlpDatasetId}/`,
        method: 'GET',
      }),
    }),
  }),
});

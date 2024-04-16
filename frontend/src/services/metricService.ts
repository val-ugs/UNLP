import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import { api } from './apiService';
import { ClassificationMetricCalculationRequest } from 'interfaces/dtos/classificationMetricCalculationDto.interface';
import { NerMetricCalculationRequest } from 'interfaces/dtos/nerMetricCalculationDto.interface';
import { SummarizationMetricCalculationRequest } from 'interfaces/dtos/summarizationMetricCalculationDto.interface';

export const metricApi = api.injectEndpoints({
  endpoints: (build: EndpointBuilder<BaseQueryFn, string, string>) => ({
    calculateClassification: build.mutation<
      string,
      ClassificationMetricCalculationRequest
    >({
      query: ({
        nlpDatasetId,
        predictedNlpDatasetId,
        metricName,
        average,
      }) => ({
        url: `nlp/metrics/classification/?nlp_dataset_pk=${nlpDatasetId}&predicted_nlp_dataset_pk=${predictedNlpDatasetId}&metric_name=${metricName}&${
          average ? `average=${average}` : ''
        }`,
        method: 'GET',
      }),
      transformResponse: (response: any) => {
        return JSON.stringify(response, undefined, 2);
      },
    }),
    calculateNer: build.mutation<string, NerMetricCalculationRequest>({
      query: ({ nlpDatasetId, predictedNlpDatasetId, metricName }) => ({
        url: `nlp/metrics/ner/?nlp_dataset_pk=${nlpDatasetId}&predicted_nlp_dataset_pk=${predictedNlpDatasetId}&metric_name=${metricName}`,
        method: 'GET',
      }),
      transformResponse: (response: any) => {
        return JSON.stringify(response, undefined, 2);
      },
    }),
    calculateSummarization: build.mutation<
      string,
      SummarizationMetricCalculationRequest
    >({
      query: ({ nlpDatasetId, predictedNlpDatasetId, metricName }) => ({
        url: `nlp/metrics/summarization/?nlp_dataset_pk=${nlpDatasetId}&predicted_nlp_dataset_pk=${predictedNlpDatasetId}&metric_name=${metricName}`,
        method: 'GET',
      }),
      transformResponse: (response: any) => {
        return JSON.stringify(response, undefined, 2);
      },
    }),
  }),
});

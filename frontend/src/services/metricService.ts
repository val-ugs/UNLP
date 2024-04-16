import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import { api } from './apiService';
import { ClassificationMetricCalculationRequest } from 'interfaces/dtos/classificationMetricCalculationDto.interface';
import { classificationMetricType } from 'interfaces/metric.interface';

export const metricApi = api.injectEndpoints({
  endpoints: (build: EndpointBuilder<BaseQueryFn, string, string>) => ({
    calculateClassification: build.mutation<
      number,
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
        console.log(response);
        console.log(classificationMetricType.Accuracy);
        console.log(classificationMetricType.Accuracy in response);
        if (classificationMetricType.Accuracy in response)
          return response[classificationMetricType.Accuracy];
        else if (classificationMetricType.F1Score in response)
          return response[classificationMetricType.F1Score];
      },
    }),
  }),
});

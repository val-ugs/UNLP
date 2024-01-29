import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import { api } from './apiService';
import { tagTypes } from './tagTypes';
import { LoadingDataDtoProps } from 'interfaces/dtos/loadingDataDto.interface';
import { objectToFormData } from 'helpers/objectToFormData';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';

export const nlpDatasetApi = api.injectEndpoints({
  endpoints: (build: EndpointBuilder<BaseQueryFn, string, string>) => ({
    getNlpDatasets: build.query<NlpDatasetProps[], void>({
      query: () => ({
        url: `/dataset-preparation/nlp-datasets/`,
      }),
      transformResponse: (response: any) => {
        return response.map((nlpDatasetData: any) => {
          return {
            id: nlpDatasetData['id'],
            nlpTexts: nlpDatasetData['nlp_texts'],
            nerLabels: nlpDatasetData['ner_labels'],
            tokenPatternToRemove: nlpDatasetData['token_pattern_to_remove'],
            tokenPatternToSplit: nlpDatasetData['token_pattern_to_split'],
          };
        });
      },
      providesTags: () => [tagTypes.NlpDataset],
    }),
    getNlpDatasetById: build.query<NlpDatasetProps, number>({
      query: (id: number) => ({
        url: `/dataset-preparation/nlp-datasets/${id}/`,
      }),
      transformResponse: (response: any) => {
        return {
          id: response['id'],
          nlpTexts: response['nlp_texts'],
          nerLabels: response['ner_labels'],
          tokenPatternToRemove: response['token_pattern_to_remove'],
          tokenPatternToSplit: response['token_pattern_to_split'],
        };
      },
      providesTags: () => [tagTypes.NlpDataset],
    }),
    postNlpDataset: build.mutation<NlpDatasetProps, LoadingDataDtoProps>({
      query: (loadingDataDto) => ({
        url: '/dataset-preparation/nlp-datasets/',
        method: 'POST',
        body: objectToFormData({
          file: loadingDataDto.file,
          text_pattern_to_split: loadingDataDto.textPatternToSplit,
        }),
        formData: true,
      }),
      invalidatesTags: [tagTypes.NlpDataset],
    }),
    putNlpDataset: build.mutation<NlpDatasetProps, NlpDatasetProps>({
      query: ({ id, ...nlpDataset }) => ({
        url: `/dataset-preparation/nlp-datasets/${id}/`,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nlp_texts: nlpDataset.nlpTexts,
          ner_labels: nlpDataset.nerLabels,
          token_pattern_to_remove: nlpDataset.tokenPatternToRemove,
          token_pattern_to_split: nlpDataset.tokenPatternToSplit,
        }),
      }),
      invalidatesTags: [tagTypes.NlpDataset],
    }),
    deleteNlpDataset: build.mutation<void, number>({
      query: (id: number) => ({
        url: `/dataset-preparation/nlp-datasets/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.NlpDataset],
    }),
    downloadNlpDataset: build.mutation<any, number>({
      query: (id: number) => ({
        url: `/dataset-preparation/nlp-datasets/${id}/download`,
        method: 'GET',
        responseType: 'blob',
      }),
    }),
  }),
});

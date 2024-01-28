import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import { api } from './apiService';
import { tagTypes } from './tagTypes';
import { LoadingDataDtoProps } from 'interfaces/dtos/loadingDataDto.interface';
import { objectToFormData } from 'helpers/objectToFormData';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';

export const nlpDatasetApi = api.injectEndpoints({
  endpoints: (build: EndpointBuilder<BaseQueryFn, string, string>) => ({
    getNlpDatasetById: build.query<NlpDatasetProps, number>({
      query: (id: number) => ({
        url: `/dataset-preparation/nlp-datasets/${id}/`,
      }),
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
        body: nlpDataset,
      }),
      invalidatesTags: [tagTypes.NlpDataset],
    }),
  }),
});

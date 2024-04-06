import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import { api } from './apiService';
import { tagTypes } from './tagTypes';
import { fieldType } from 'data/enums/fieldType';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';

export const actionApi = api.injectEndpoints({
  endpoints: (build: EndpointBuilder<BaseQueryFn, string, string>) => ({
    clearNlpDataset: build.mutation<
      NlpDatasetProps,
      { nlpDatasetId: number; clearField: fieldType }
    >({
      query: ({ nlpDatasetId, clearField }) => ({
        url: `/actions/clear/${nlpDatasetId}/?field=${clearField}`,
        method: 'GET',
      }),
      invalidatesTags: [tagTypes.NlpDataset],
    }),
    copyNlpDataset: build.mutation<NlpDatasetProps, number>({
      query: (nlpDatasetId) => ({
        url: `/actions/copy/${nlpDatasetId}/`,
        method: 'GET',
      }),
      invalidatesTags: [tagTypes.NlpDataset],
    }),
  }),
});

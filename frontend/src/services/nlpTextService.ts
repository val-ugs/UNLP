import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import { api } from './apiService';
import { NlpTextProps } from 'interfaces/nlpText.interface';
import { tagTypes } from './tagTypes';

export const nlpTextApi = api.injectEndpoints({
  endpoints: (build: EndpointBuilder<BaseQueryFn, string, string>) => ({
    getNlpTextsByNlpDatasetId: build.query<NlpTextProps[], number>({
      query: (nlpDatasetId: number) => ({
        url: `/dataset-preparation/nlp-text/?nlp_dataset=${nlpDatasetId}`,
      }),
      providesTags: () => [tagTypes.NlpText],
    }),
    getNlpTextById: build.query<NlpTextProps, number>({
      query: (id: number) => ({
        url: `/dataset-preparation/nlp-texts/${id}/`,
      }),
      providesTags: () => [tagTypes.NlpText],
    }),
    putNlpText: build.mutation<NlpTextProps, NlpTextProps>({
      query: ({ id, ...nlpText }) => ({
        url: `/dataset-preparation/nlp-texts/${id}/`,
        method: 'PUT',
        body: nlpText,
      }),
      invalidatesTags: [tagTypes.NlpText],
    }),
  }),
});

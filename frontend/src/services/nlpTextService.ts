import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import { api } from './apiService';
import { NlpTextProps } from 'interfaces/nlpText.interface';
import { tagTypes } from './tagTypes';

export const nlpTextApi = api.injectEndpoints({
  endpoints: (build: EndpointBuilder<BaseQueryFn, string, string>) => ({
    getNlpTextsByNlpDatasetId: build.query<NlpTextProps[], number>({
      query: (nlpDatasetId: number) => ({
        url: `/dataset-preparation/nlp-datasets/${nlpDatasetId}/nlp-texts/`,
      }),
      transformResponse: (response: any) => {
        return response.map((nlpTextData: any) => ({
          id: nlpTextData['id'],
          text: nlpTextData['text'],
          classificationLabel: nlpTextData['classification_label'],
          nlpTokens: nlpTextData['nlp_tokens'],
        }));
      },
      providesTags: () => [tagTypes.NlpText, tagTypes.NlpDataset],
    }),
    getNlpTextById: build.query<NlpTextProps, number>({
      query: (id: number) => ({
        url: `/dataset-preparation/nlp-texts/${id}/`,
      }),
      transformResponse: (response: any) => {
        return {
          id: response['id'],
          text: response['text'],
          classificationLabel: response['classification_label'],
          nlpTokens: response['nlp_tokens'],
        };
      },
      providesTags: () => [tagTypes.NlpText],
    }),
    putNlpText: build.mutation<NlpTextProps, NlpTextProps>({
      query: ({ id, ...nlpText }) => ({
        url: `/dataset-preparation/nlp-texts/${id}/`,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: nlpText.text,
          classification_label: nlpText.classificationLabel,
          nlp_tokens: nlpText.nlpTokens,
        }),
      }),
      invalidatesTags: [tagTypes.NlpText],
    }),
    deleteNlpText: build.mutation<void, number>({
      query: (id: number) => ({
        url: `/dataset-preparation/nlp-texts/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.NlpText],
    }),
  }),
});

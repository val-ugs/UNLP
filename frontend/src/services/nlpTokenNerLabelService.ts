import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import { api } from './apiService';
import { tagTypes } from './tagTypes';
import { NlpTokenNerLabelProps } from 'interfaces/nlpTokenNerLabel.interface';

export const nlpTokenNerLabelApi = api.injectEndpoints({
  endpoints: (build: EndpointBuilder<BaseQueryFn, string, string>) => ({
    getNlpTokenNerLabelByNlpTokenId: build.query<NlpTokenNerLabelProps, number>(
      {
        query: (nlpTokenId: number) => ({
          url: `/dataset-preparation/nlp-tokens/${nlpTokenId}/nlp-token-ner-labels/`,
        }),
        transformResponse: (response: any) => {
          return {
            nlpTokenId: response['nlp_token'],
            nerLabel: response['ner_label'],
            initial: response['initial'],
          };
        },
        providesTags: () => [tagTypes.NlpTokenNerLabel],
      }
    ),
    postNlpTokenNerLabel: build.mutation<
      NlpTokenNerLabelProps,
      { nlpTokenId: number; nlpTokenNerLabel: NlpTokenNerLabelProps }
    >({
      query: ({ nlpTokenId, nlpTokenNerLabel }) => ({
        url: `/dataset-preparation/nlp-tokens/${nlpTokenId}/nlp-token-ner-labels/`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ner_label: {
            id: nlpTokenNerLabel.nerLabel?.id,
            color: nlpTokenNerLabel.nerLabel?.color,
            name: nlpTokenNerLabel.nerLabel?.name,
          },
          initial: nlpTokenNerLabel.initial,
        }),
      }),
      invalidatesTags: [tagTypes.NlpTokenNerLabel],
    }),
    putNlpTokenNerLabel: build.mutation<
      NlpTokenNerLabelProps,
      NlpTokenNerLabelProps
    >({
      query: ({ nlpTokenId, ...nlpTokenNerLabel }) => ({
        url: `/dataset-preparation/nlp-tokens/${nlpTokenId}/nlp-token-ner-labels/`,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ner_label: {
            id: nlpTokenNerLabel.nerLabel?.id,
            color: nlpTokenNerLabel.nerLabel?.color,
            name: nlpTokenNerLabel.nerLabel?.name,
          },
          initial: nlpTokenNerLabel.initial,
        }),
      }),
      invalidatesTags: [tagTypes.NlpTokenNerLabel],
    }),
    deleteNlpTokenNerLabel: build.mutation<void, number>({
      query: (nlpTokenId: number) => ({
        url: `/dataset-preparation/nlp-tokens/${nlpTokenId}/nlp-token-ner-labels/`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.NlpTokenNerLabel],
    }),
  }),
});

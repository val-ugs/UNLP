import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import { api } from './apiService';
import { NlpTextProps } from 'interfaces/nlpText.interface';
import { NlpTokenProps } from 'interfaces/nlpToken.interface';
import { tagTypes } from './tagTypes';

export const nlpTokenApi = api.injectEndpoints({
  endpoints: (build: EndpointBuilder<BaseQueryFn, string, string>) => ({
    getNlpTokenByNlpTextId: build.query<NlpTokenProps[], number>({
      query: (nlpTextId: number) => ({
        url: `/dataset-preparation/nlp-texts/${nlpTextId}/nlp-tokens/`,
      }),
      providesTags: () => [tagTypes.NlpToken, tagTypes.NlpDataset],
    }),
    putNlpToken: build.mutation<NlpTextProps, NlpTokenProps>({
      query: ({ id, ...nlpToken }) => ({
        url: `/dataset-preparation/nlp-texts/${id}/`,
        method: 'PUT',
        body: nlpToken,
      }),
      invalidatesTags: [tagTypes.NlpToken],
    }),
  }),
});

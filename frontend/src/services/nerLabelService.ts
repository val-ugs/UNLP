import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import { api } from './apiService';
import { tagTypes } from './tagTypes';
import { NerLabelProps } from 'interfaces/nerLabel.interface';

export const nerLabelApi = api.injectEndpoints({
  endpoints: (build: EndpointBuilder<BaseQueryFn, string, string>) => ({
    getNerLabelsByNlpDatasetId: build.query<NerLabelProps[], number>({
      query: (nlpDatasetId: number) => ({
        url: `/dataset-preparation/nlp-datasets/${nlpDatasetId}/ner-labels/`,
      }),
      transformResponse: (response: any) => {
        return response.map((nerLabelData: any) => ({
          id: nerLabelData['id'],
          name: nerLabelData['name'],
          color: nerLabelData['color'],
        }));
      },
      providesTags: () => [tagTypes.NerLabel],
    }),
    postNerLabel: build.mutation<
      NerLabelProps,
      { nlpDatasetId: number; nerLabel: NerLabelProps }
    >({
      query: ({ nlpDatasetId, nerLabel }) => ({
        url: `/dataset-preparation/nlp-datasets/${nlpDatasetId}/ner-labels/`,
        method: 'POST',
        body: nerLabel,
      }),
      invalidatesTags: [tagTypes.NerLabel],
    }),
    putNerLabel: build.mutation<NerLabelProps, NerLabelProps>({
      query: ({ id, ...nerLabel }) => ({
        url: `/dataset-preparation/ner-labels/${id}/`,
        method: 'PUT',
        body: nerLabel,
      }),
      invalidatesTags: [tagTypes.NerLabel],
    }),
    deleteNerLabel: build.mutation<void, number>({
      query: (id: number) => ({
        url: `/dataset-preparation/ner-labels/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.NerLabel],
    }),
  }),
});

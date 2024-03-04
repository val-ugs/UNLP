import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import { api } from './apiService';
import { NlpTextProps } from 'interfaces/nlpText.interface';
import {
  GetNlpTextPageRequestProps,
  GetNlpTextPageResponseProps,
} from 'interfaces/dtos/getNlpTextPage.interface';
import { tagTypes } from './tagTypes';

export const nlpTextApi = api.injectEndpoints({
  endpoints: (build: EndpointBuilder<BaseQueryFn, string, string>) => ({
    getNlpTexts: build.query<
      GetNlpTextPageResponseProps,
      GetNlpTextPageRequestProps
    >({
      query: (GetNlpTextPageRequest: GetNlpTextPageRequestProps) => ({
        url: `/dataset-preparation/${
          GetNlpTextPageRequest.nlpDatasetId
            ? `nlp-datasets/${GetNlpTextPageRequest.nlpDatasetId}/`
            : ''
        }nlp-texts/?${
          GetNlpTextPageRequest.search
            ? `search=${GetNlpTextPageRequest.search}&`
            : ''
        }${
          GetNlpTextPageRequest.sort
            ? `sort=${GetNlpTextPageRequest.sort}&`
            : ''
        }${
          GetNlpTextPageRequest.pageSize
            ? `page_size=${GetNlpTextPageRequest.pageSize}&`
            : ''
        }${
          GetNlpTextPageRequest.page ? `page=${GetNlpTextPageRequest.page}` : ''
        }`,
      }),
      transformResponse: (response: any) => {
        return {
          nlpTextsCount: response['count'],
          nlpTexts: response['results'].map((nlpTextData: any) => ({
            id: nlpTextData['id'],
            text: nlpTextData['text'],
            classificationLabel: nlpTextData['classification_label'],
            summarization: nlpTextData['summarization'],
          })),
        };
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
          summarization: response['summarization'],
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
          summarization: nlpText.summarization,
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

import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import { api } from './apiService';
import { tagTypes } from './tagTypes';
import { fieldType } from 'data/enums/fieldType';
import { createNlpDatasetByFieldDtoProps } from 'interfaces/dtos/createNlpDatasetByFieldDto.interface';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';

export const actionApi = api.injectEndpoints({
  endpoints: (build: EndpointBuilder<BaseQueryFn, string, string>) => ({
    clearNlpDataset: build.mutation<
      NlpDatasetProps,
      { nlpDatasetId: number; field: fieldType }
    >({
      query: ({ nlpDatasetId, field }) => ({
        url: `/actions/clear/${nlpDatasetId}/?field=${field}`,
        method: 'GET',
      }),
      invalidatesTags: [tagTypes.NlpDataset],
    }),
    copyNlpDataset: build.mutation<void, number>({
      query: (nlpDatasetId) => ({
        url: `/actions/copy/${nlpDatasetId}/`,
        method: 'GET',
      }),
      invalidatesTags: [tagTypes.NlpDataset],
    }),
    createByFieldNlpDataset: build.mutation<
      void,
      {
        nlpDatasetId: number;
        createNlpDatasetByFieldDto: createNlpDatasetByFieldDtoProps;
      }
    >({
      query: ({
        nlpDatasetId,
        createNlpDatasetByFieldDto: {
          field,
          nerLabelId,
          isClassificationLabelSaved,
          isSummarizationSaved,
        },
      }) => ({
        url: `/actions/create-by-field/${nlpDatasetId}/?field=${field}&${
          nerLabelId ? `ner-label-id=${nerLabelId}&` : ''
        }is-classification-label-saved=${isClassificationLabelSaved}&is-summarization-saved=${isSummarizationSaved}`,
        method: 'GET',
      }),
      invalidatesTags: [tagTypes.NlpDataset],
    }),
  }),
});

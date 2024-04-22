import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import { api } from './apiService';
import { tagTypes } from './tagTypes';
import { fieldType } from 'data/enums/fieldType';
import { createNlpDatasetByFieldDtoProps } from 'interfaces/dtos/createNlpDatasetByFieldDto.interface';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';
import { CreateNlpTokenNerLabelsByPatternDtoProps } from 'interfaces/dtos/createNlpTokenNerLabelsByPatternDto';

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
      transformResponse: (response: any) => {
        return {
          id: response['id'],
          tokenPatternToRemove: response['token_pattern_to_remove'],
          tokenPatternToSplit: response['token_pattern_to_split'],
        };
      },
      invalidatesTags: [tagTypes.NlpDataset],
    }),
    copyNlpDataset: build.mutation<NlpDatasetProps, number>({
      query: (nlpDatasetId) => ({
        url: `/actions/copy/${nlpDatasetId}/`,
        method: 'GET',
      }),
      transformResponse: (response: any) => {
        return {
          id: response['id'],
          tokenPatternToRemove: response['token_pattern_to_remove'],
          tokenPatternToSplit: response['token_pattern_to_split'],
        };
      },
      invalidatesTags: [tagTypes.NlpDataset],
    }),
    createNlpDatasetByField: build.mutation<
      NlpDatasetProps,
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
      transformResponse: (response: any) => {
        return {
          id: response['id'],
          tokenPatternToRemove: response['token_pattern_to_remove'],
          tokenPatternToSplit: response['token_pattern_to_split'],
        };
      },
      invalidatesTags: [tagTypes.NlpDataset],
    }),
    deleteTextsWithoutFieldsNlpDataset: build.mutation<NlpDatasetProps, number>(
      {
        query: (nlpDatasetId) => ({
          url: `/actions/delete-texts-without-fields/${nlpDatasetId}/`,
          method: 'GET',
        }),
        transformResponse: (response: any) => {
          return {
            id: response['id'],
            tokenPatternToRemove: response['token_pattern_to_remove'],
            tokenPatternToSplit: response['token_pattern_to_split'],
          };
        },
        invalidatesTags: [tagTypes.NlpDataset],
      }
    ),
    createNlpTokenNerLabelsByPattern: build.mutation<
      NlpDatasetProps,
      CreateNlpTokenNerLabelsByPatternDtoProps
    >({
      query: (createNlpTokenNerLabelsByPatternDto) => ({
        url: `/actions/create-nlp-token-ner-labels-by-pattern/${createNlpTokenNerLabelsByPatternDto.nlpDatasetId}/`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          createNlpTokenNerLabelsByPatternDto.nerLabelPatterns.map(
            (nerLabelPattern) => {
              return {
                ner_label_id: nerLabelPattern.nerLabel.id,
                pattern: nerLabelPattern.pattern,
              };
            }
          )
        ),
      }),
      transformResponse: (response: any) => {
        return {
          id: response['id'],
          tokenPatternToRemove: response['token_pattern_to_remove'],
          tokenPatternToSplit: response['token_pattern_to_split'],
        };
      },
      invalidatesTags: [tagTypes.NlpDataset],
    }),
  }),
});

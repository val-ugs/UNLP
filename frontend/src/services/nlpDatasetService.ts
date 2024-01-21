import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import { api } from './apiService';
import { LoadingDataDtoProps } from 'interfaces/dtos/loadingDataDto.interface';
import { objectToFormData } from 'helpers/objectToFormData';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';

export const nlpDatasetApi = api.injectEndpoints({
  endpoints: (build: EndpointBuilder<BaseQueryFn, string, string>) => ({
    postNlpDataset: build.mutation<NlpDatasetProps, LoadingDataDtoProps>({
      query: (loadingData) => ({
        url: '/dataset-preparation/nlp-datasets/',
        method: 'POST',
        body: objectToFormData(loadingData),
        formData: true,
      }),
    }),
  }),
});

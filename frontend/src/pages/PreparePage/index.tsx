import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { skipToken } from '@reduxjs/toolkit/query';
import Layout from 'pages/_layouts/Layout';
import NlpDatasets from './components/NlpDatasets';
import NlpTexts from './components/NlpTexts';
import NlpTextForm from './components/NlpTextForm';
import NerLabels from './components/NerLabels';
import { useAppSelector } from 'hooks/redux';
import { nlpDatasetApi } from 'services/nlpDatasetService';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';
import Menu from './components/Menu';
import './styles.scss';

const PreparePage: FC = () => {
  const { t } = useTranslation();
  const [nlpDataset, setNlpDataset] = useState<NlpDatasetProps | undefined>(
    undefined
  );
  const [selectedNlpDatasetId, setSelectedNlpDatasetId] = useState<
    number | undefined
  >(undefined);
  const { nlpDatasetId } = useAppSelector((state) => state.nlpDatasetReducer);
  const {
    data: nlpDatasetData,
    error,
    isLoading,
  } = nlpDatasetApi.useGetNlpDatasetByIdQuery(
    selectedNlpDatasetId ? Number(selectedNlpDatasetId) : skipToken
  );
  const [selectedNlpTextId, setSelectedNlpTextId] = useState<
    number | undefined
  >(undefined);

  useEffect(() => {
    if (nlpDatasetId) setSelectedNlpDatasetId(nlpDatasetId);
  }, [nlpDatasetId]);

  useEffect(() => {
    setNlpDataset(nlpDatasetData);
  }, [nlpDatasetData]);

  return (
    <Layout>
      <div className="prepare-page">
        <Menu className="prepare-page__menu" nlpDataset={nlpDataset} />
        <NlpDatasets
          className="prepare-page__datasets"
          selectedNlpDatasetId={selectedNlpDatasetId}
          setSelectedNlpDatasetId={setSelectedNlpDatasetId}
        />
        <div className="prepare-page__body">
          {selectedNlpDatasetId ? (
            <NlpTexts
              className="prepare-page__sidebar-left"
              nlpDatasetId={selectedNlpDatasetId}
              selectedNlpTextId={selectedNlpTextId}
              setSelectedNlpTextId={setSelectedNlpTextId}
            />
          ) : (
            <div className="prepare-page__sidebar-left">
              {t(
                'preparePage.datasetNotSelectedOrNotFound',
                'Dataset not selected or not found'
              )}
            </div>
          )}
          {selectedNlpTextId && nlpDataset ? (
            <NlpTextForm
              className="prepare-page__text-nlp-form"
              selectedNlpTextId={selectedNlpTextId}
              nlpDataset={nlpDataset}
            />
          ) : (
            <div className="prepare-page__text-nlp-form">
              {t(
                'preparePage.textNotSelectedOrNotFound',
                'Text not selected or not found'
              )}
            </div>
          )}
          <NerLabels
            className="prepare-page__sidebar-right"
            nlpDatasetId={nlpDataset?.id}
          />
        </div>
      </div>
    </Layout>
  );
};

export default PreparePage;

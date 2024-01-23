import React, { FC, useEffect, useState } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';
import camelize from 'camelize';
import Layout from 'pages/_layouts/Layout';
import Button from 'components/common/Button';
import NlpTexts from './components/NlpTexts';
import NlpTextForm from './components/NlpTextForm';
import NerLabels from './components/NerLabels';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { loadDataModalSlice } from 'store/reducers/loadDataModalSlice';
import { nlpDatasetApi } from 'services/nlpDatasetService';
import './styles.scss';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';

const PreparePage: FC = () => {
  const [nlpDataset, setNlpDataset] = useState<NlpDatasetProps | undefined>(
    undefined
  );
  const { nlpDatasetId } = useAppSelector((state) => state.nlpDatasetReducer);
  const {
    data: nlpDatasetData,
    error,
    isLoading,
  } = nlpDatasetApi.useGetNlpDatasetByIdQuery(
    nlpDatasetId ? Number(nlpDatasetId) : skipToken
  );
  const [selectedNlpTextId, setSelectedNlpTextId] = useState<
    number | undefined
  >(undefined);
  const { activate } = loadDataModalSlice.actions;
  const dispatch = useAppDispatch();

  useEffect(() => {
    setNlpDataset(camelize(nlpDatasetData));
  }, [nlpDatasetData]);

  const handleLoadData = () => dispatch(activate());

  const handleSaveData = () => {
    console.log(nlpDataset);
  };

  const handleConvertNerLabelOrSummarizationToText = () => {};

  return (
    <Layout>
      <div className="prepare-page">
        <div className="prepare-page__main">
          <div className="prepare-page__buttons">
            <Button className="prepare-page__button" onClick={handleLoadData}>
              Load data
            </Button>
            <Button className="prepare-page__button" onClick={handleSaveData}>
              Save data
            </Button>
            <Button
              className="prepare-page__button"
              onClick={handleConvertNerLabelOrSummarizationToText}
            >
              Convert NER Label or Summarization to text
            </Button>
          </div>
          <div className="prepare-page__body">
            <NlpTexts
              className="prepare-page__sidebar-left"
              nlpDatasetId={nlpDataset?.id}
              selectedNlpTextId={selectedNlpTextId}
              setSelectedNlpTextId={setSelectedNlpTextId}
            />
            {selectedNlpTextId && nlpDataset ? (
              <NlpTextForm
                className="prepare-page__text-nlp-form"
                selectedNlpTextId={selectedNlpTextId}
                nlpDataset={nlpDataset}
              />
            ) : (
              <div className="prepare-page__text-nlp-form">
                Text not selected or not found
              </div>
            )}
            <NerLabels
              className="prepare-page__sidebar-right"
              nlpDatasetId={nlpDataset?.id}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PreparePage;

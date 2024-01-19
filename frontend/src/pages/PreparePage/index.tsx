import React, { FC, useState } from 'react';
import Layout from 'pages/_layouts/Layout';
import Button from 'components/common/Button';
import NlpTexts from './components/NlpTexts';
import NlpTextForm from './components/NlpTextForm';
import NerLabels from './components/NerLabels';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { loadDataModalSlice } from 'store/reducers/loadDataModalSlice';
import './styles.scss';

const PreparePage: FC = () => {
  const { nlpDataset } = useAppSelector((state) => state.nlpDatasetReducer);
  const [selectedNlpTextId, setSelectedNlpTextId] = useState<
    number | undefined
  >(undefined);
  const { activate } = loadDataModalSlice.actions;
  const dispatch = useAppDispatch();

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
              nlpDataset={nlpDataset}
              selectedNlpTextId={selectedNlpTextId}
              setSelectedNlpTextId={setSelectedNlpTextId}
            />
            {selectedNlpTextId ? (
              <NlpTextForm
                className="prepare-page__text-nlp-form"
                selectedNlpTextId={selectedNlpTextId}
              />
            ) : (
              <div className="prepare-page__text-nlp-form">
                Text not selected or not found
              </div>
            )}
            <NerLabels className="prepare-page__sidebar-right" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PreparePage;

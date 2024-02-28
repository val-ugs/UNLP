import React, { FC, useEffect, useState } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useAppDispatch } from 'hooks/redux';
import Button from 'components/common/Button';
import { enumToArray } from 'helpers/enumToArray';
import LabeledElement from 'components/interstitial/LabeledElement';
import Select, { SelectProps } from 'components/common/Select';
import {
  HuggingFaceModelProps,
  HuggingFaceModelType,
} from 'interfaces/huggingFaceModel.interface';
import { huggingFaceModelApi } from 'services/huggingFaceModelService';
import HuggingFaceModelInfo from 'components/interstitial/HuggingFaceModelInfo';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';
import { nlpDatasetApi } from 'services/nlpDatasetService';
import './styles.scss';

interface HuggingFaceModelPredictProps {
  className: string;
  huggingFaceModel: HuggingFaceModelProps | undefined;
  setHuggingFaceModel: React.Dispatch<
    React.SetStateAction<HuggingFaceModelProps | undefined>
  >;
  testNlpDatasetId: number;
  setTestNlpDatasetId: React.Dispatch<React.SetStateAction<number>>;
}

const HuggingFaceModelPredict: FC<HuggingFaceModelPredictProps> = ({
  className,
  huggingFaceModel,
  setHuggingFaceModel,
  testNlpDatasetId,
  setTestNlpDatasetId,
}) => {
  const [nlpDatasets, setNlpDatasets] = useState<NlpDatasetProps[]>([]);
  const [huggingFaceModelType, setHuggingFaceModelType] =
    useState<HuggingFaceModelType>(HuggingFaceModelType.Classification);
  const [huggingFaceModels, setHuggingFaceModels] =
    useState<HuggingFaceModelProps[]>();
  const {
    data: huggingFaceModelsData,
    isLoading: huggingFaceModelsLoading,
    isError,
  } = huggingFaceModelApi.useGetHugginsFaceModelsByTypeQuery(
    huggingFaceModelType ?? skipToken
  );
  const {
    data: nlpDatasetsData,
    error,
    isLoading: nlpDatasetsLoading,
  } = nlpDatasetApi.useGetNlpDatasetsQuery();

  useEffect(() => {
    if (nlpDatasetsData) setNlpDatasets(nlpDatasetsData);
  }, [nlpDatasetsData]);

  useEffect(() => {
    if (huggingFaceModelsData) setHuggingFaceModels(huggingFaceModelsData);
    if (isError) setHuggingFaceModels(undefined);
  }, [huggingFaceModelsData, isError]);

  const setHuggingFaceModelValue = (value: number) => {
    const huggingFaceModel = huggingFaceModels?.find((hfm) => hfm.id == value);
    if (huggingFaceModel) setHuggingFaceModel(huggingFaceModel);
  };
  const huggingFaceModelSelect: SelectProps<number> = {
    className: 'hugging-face-model-predict__select',
    selectedValue: huggingFaceModel?.id ?? 0,
    setSelectedValue: setHuggingFaceModelValue,
    children: huggingFaceModels?.map(
      (huggingFaceModel: HuggingFaceModelProps) => {
        return (
          <Select.Item key={huggingFaceModel.id} value={huggingFaceModel.id}>
            {huggingFaceModel.name}
          </Select.Item>
        );
      }
    ),
  };

  const setTestNlpDatasetIdValue = (value: number) => {
    setTestNlpDatasetId(value);
  };
  const testNlpDatasetSelect: SelectProps<number> = {
    className: 'hugging-face-model-__select',
    selectedValue: testNlpDatasetId ?? 0,
    setSelectedValue: setTestNlpDatasetIdValue,
    children: nlpDatasets?.map((nlpDataset: NlpDatasetProps) => {
      return (
        <Select.Item key={nlpDataset.id} value={nlpDataset.id}>
          {`Dataset ${nlpDataset.id}`}
        </Select.Item>
      );
    }),
  };

  return (
    <div className={`hugging-face-model-predict ${className}`}>
      <div className="hugging-face-model-predict__item">
        <div className="hugging-face-model-predict__type">
          {enumToArray(HuggingFaceModelType).map(
            (hfmt: HuggingFaceModelType) => (
              <div className="hugging-face-model-predict__type-item" key={hfmt}>
                <Button
                  className={`hugging-face-model-predict__type-button ${
                    hfmt == huggingFaceModelType ? 'active' : ''
                  }`}
                  onClick={() => {
                    setHuggingFaceModelType(hfmt);
                    setHuggingFaceModel(undefined);
                  }}
                >
                  {hfmt}
                </Button>
              </div>
            )
          )}
        </div>
      </div>
      <div className="hugging-face-model-predict__item">
        {huggingFaceModels ? (
          <div className="hugging-face-model-predict__model">
            <LabeledElement
              className="hugging-face-model-predict__model-item hugging-face-model-predict__labeled-element"
              labelElement={{ value: 'Select hugging face model' }}
            >
              <Select
                className={huggingFaceModelSelect.className}
                selectedValue={huggingFaceModelSelect.selectedValue}
                setSelectedValue={huggingFaceModelSelect.setSelectedValue}
                disabled={huggingFaceModelSelect.disabled}
              >
                {huggingFaceModelSelect.children}
              </Select>
            </LabeledElement>
          </div>
        ) : (
          'Hugging face models not found'
        )}
        <div className="hugging-face-model-predict__item">
          <HuggingFaceModelInfo huggingFaceModel={huggingFaceModel} />
        </div>
        <div className="hugging-face-model-predict__item">
          <LabeledElement
            className="hugging-face-model-predict__labeled-element"
            labelElement={{ value: 'Select test nlp dataset' }}
          >
            <Select
              className={testNlpDatasetSelect.className}
              selectedValue={testNlpDatasetSelect.selectedValue}
              setSelectedValue={testNlpDatasetSelect.setSelectedValue}
              disabled={testNlpDatasetSelect.disabled}
            >
              {testNlpDatasetSelect.children}
            </Select>
          </LabeledElement>
        </div>
      </div>
    </div>
  );
};

export default HuggingFaceModelPredict;

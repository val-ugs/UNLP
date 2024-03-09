import React, { FC, useEffect, useState } from 'react';
import { useAppDispatch } from 'hooks/redux';
import Select, { SelectProps } from 'components/common/Select';
import { nlpDatasetApi } from 'services/nlpDatasetService';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';
import LabeledElement from 'components/interstitial/LabeledElement';
import InputButton from 'components/common/Inputs/InputButton';
import { actionApi } from 'services/actionService';
import { clearFieldType } from 'data/enums/clearFieldType';
import { enumToArray } from 'helpers/enumToArray';
import { actionModalSlice } from 'store/reducers/actionModalSlice';
import './styles.scss';

const NlpDatasetCleaning: FC = () => {
  const [nlpDatasets, setNlpDatasets] = useState<NlpDatasetProps[]>([]);
  const [nlpDatasetId, setNlpDatasetId] = useState<number>();
  const [clearField, setClearField] = useState<clearFieldType>(
    clearFieldType.ClassificationLabel
  );
  const { deactivate } = actionModalSlice.actions;
  const dispatch = useAppDispatch();
  const [clearNlpDataset, {}] = actionApi.useClearNlpDatasetMutation();
  const {
    data: nlpDatasetsData,
    error,
    isLoading,
  } = nlpDatasetApi.useGetNlpDatasetsQuery();

  useEffect(() => {
    if (nlpDatasetsData) setNlpDatasets(nlpDatasetsData);
  }, [nlpDatasetsData]);

  const setNlpDatasetIdValue = (value: number) => {
    setNlpDatasetId(value);
  };
  const nlpDatasetSelect: SelectProps<number> = {
    className: 'nlp-dataset-cleaning__select',
    selectedValue: nlpDatasetId ?? 0,
    setSelectedValue: setNlpDatasetIdValue,
    children: nlpDatasets?.map((nlpDataset: NlpDatasetProps) => {
      return (
        <Select.Item key={nlpDataset.id} value={nlpDataset.id}>
          {`Dataset ${nlpDataset.id}`}
        </Select.Item>
      );
    }),
  };

  const setClearFieldValue = (value: string) => {
    setClearField(value as clearFieldType);
  };
  const clearFieldSelect: SelectProps<string> = {
    className: 'nlp-dataset-cleaning__select',
    selectedValue: clearField ?? '',
    setSelectedValue: setClearFieldValue,
    children: enumToArray(clearFieldType).map((cf: clearFieldType) => {
      return (
        <Select.Item key={cf} value={cf}>
          {cf}
        </Select.Item>
      );
    }),
  };

  const handleSubmit = () => {
    if (nlpDatasetId) clearNlpDataset({ nlpDatasetId, clearField });
    dispatch(deactivate());
  };

  return (
    <div className="nlp-dataset-cleaning">
      <form onSubmit={handleSubmit}>
        <div className="nlp-dataset-cleaning__item">
          <LabeledElement
            className="nlp-dataset-cleaning__labeled-element"
            labelElement={{ value: 'Select nlp dataset' }}
          >
            <Select
              className={nlpDatasetSelect.className}
              selectedValue={nlpDatasetSelect.selectedValue}
              setSelectedValue={nlpDatasetSelect.setSelectedValue}
              disabled={nlpDatasetSelect.disabled}
            >
              {nlpDatasetSelect.children}
            </Select>
          </LabeledElement>
        </div>
        <div className="nlp-dataset-cleaning__item">
          <LabeledElement
            className="nlp-dataset-cleaning__labeled-element"
            labelElement={{ value: 'Select field to clear' }}
          >
            <Select
              className={clearFieldSelect.className}
              selectedValue={clearFieldSelect.selectedValue}
              setSelectedValue={clearFieldSelect.setSelectedValue}
              disabled={clearFieldSelect.disabled}
            >
              {clearFieldSelect.children}
            </Select>
          </LabeledElement>
        </div>
        <div className="nlp-dataset-cleaning__item nlp-dataset-cleaning__item-button">
          <InputButton className="nlp-dataset-cleaning__button">
            Clear
          </InputButton>
        </div>
      </form>
    </div>
  );
};

export default NlpDatasetCleaning;

import React, { FC, useEffect, useState } from 'react';
import { useAppDispatch } from 'hooks/redux';
import Select, { SelectProps } from 'components/common/Select';
import { nlpDatasetApi } from 'services/nlpDatasetService';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';
import LabeledElement from 'components/interstitial/LabeledElement';
import InputButton from 'components/common/Inputs/InputButton';
import { actionApi } from 'services/actionService';
import { fieldType } from 'data/enums/fieldType';
import { enumToArray } from 'helpers/enumToArray';
import { actionModalSlice } from 'store/reducers/actionModalSlice';
import './styles.scss';

const NlpDatasetClearing: FC = () => {
  const [nlpDatasets, setNlpDatasets] = useState<NlpDatasetProps[]>([]);
  const [nlpDatasetId, setNlpDatasetId] = useState<number>();
  const [clearField, setClearField] = useState<fieldType>(
    fieldType.ClassificationLabel
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
    className: 'nlp-dataset-clearing__select',
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
    setClearField(value as fieldType);
  };
  const clearFieldSelect: SelectProps<string> = {
    className: 'nlp-dataset-clearing__select',
    selectedValue: clearField ?? '',
    setSelectedValue: setClearFieldValue,
    children: enumToArray(fieldType).map((cf: fieldType) => {
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
    <div className="nlp-dataset-clearing">
      <form onSubmit={handleSubmit}>
        <div className="nlp-dataset-clearing__item">
          <LabeledElement
            className="nlp-dataset-clearing__labeled-element"
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
        <div className="nlp-dataset-clearing__item">
          <LabeledElement
            className="nlp-dataset-clearing__labeled-element"
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
        <div className="nlp-dataset-clearing__item nlp-dataset-clearing__item-button">
          <InputButton className="nlp-dataset-clearing__button">
            Clear
          </InputButton>
        </div>
      </form>
    </div>
  );
};

export default NlpDatasetClearing;
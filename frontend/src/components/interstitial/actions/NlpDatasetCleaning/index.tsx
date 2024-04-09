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

const NlpDatasetCleaning: FC = () => {
  const [nlpDatasets, setNlpDatasets] = useState<NlpDatasetProps[]>([]);
  const [nlpDatasetId, setNlpDatasetId] = useState<number>();
  const [field, setField] = useState<fieldType>(fieldType.ClassificationLabel);
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

  const setFieldValue = (value: string) => {
    setField(value as fieldType);
  };
  const fieldSelect: SelectProps<string> = {
    className: 'nlp-dataset-cleaning__select',
    selectedValue: field ?? '',
    setSelectedValue: setFieldValue,
    children: enumToArray(fieldType).map((ft: fieldType) => {
      return (
        <Select.Item key={ft} value={ft}>
          {ft}
        </Select.Item>
      );
    }),
  };

  const handleSubmit = () => {
    if (nlpDatasetId) clearNlpDataset({ nlpDatasetId, field });
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
              className={fieldSelect.className}
              selectedValue={fieldSelect.selectedValue}
              setSelectedValue={fieldSelect.setSelectedValue}
              disabled={fieldSelect.disabled}
            >
              {fieldSelect.children}
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

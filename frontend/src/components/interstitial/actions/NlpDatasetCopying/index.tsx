import React, { FC, useEffect, useState } from 'react';
import { useAppDispatch } from 'hooks/redux';
import Select, { SelectProps } from 'components/common/Select';
import { nlpDatasetApi } from 'services/nlpDatasetService';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';
import LabeledElement from 'components/interstitial/LabeledElement';
import InputButton from 'components/common/Inputs/InputButton';
import { actionApi } from 'services/actionService';
import { actionModalSlice } from 'store/reducers/actionModalSlice';
import './styles.scss';

const NlpDatasetCopying: FC = () => {
  const [nlpDatasets, setNlpDatasets] = useState<NlpDatasetProps[]>([]);
  const [nlpDatasetId, setNlpDatasetId] = useState<number>();
  const { deactivate } = actionModalSlice.actions;
  const dispatch = useAppDispatch();
  const [copyNlpDataset, {}] = actionApi.useCopyNlpDatasetMutation();
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

  const handleSubmit = () => {
    if (nlpDatasetId) copyNlpDataset(nlpDatasetId);
    dispatch(deactivate());
  };

  return (
    <div className="nlp-dataset-copying">
      <form onSubmit={handleSubmit}>
        <div className="nlp-dataset-copying__item">
          <LabeledElement
            className="nlp-dataset-copying__labeled-element"
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
        <div className="nlp-dataset-copying__item nlp-dataset-copying__item-button">
          <InputButton className="nlp-dataset-copying__button">
            Copy
          </InputButton>
        </div>
      </form>
    </div>
  );
};

export default NlpDatasetCopying;

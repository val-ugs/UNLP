import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from 'hooks/redux';
import Select, { SelectProps } from 'components/common/Select';
import { nlpDatasetApi } from 'services/nlpDatasetService';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';
import LabeledElement from 'components/interstitial/LabeledElement';
import InputButton from 'components/common/Inputs/InputButton';
import { actionApi } from 'services/actionService';
import { actionModalSlice } from 'store/reducers/actionModalSlice';
import './styles.scss';

const NlpDatasetDeletingTextsWithoutFields: FC = () => {
  const { t } = useTranslation();
  const [nlpDatasets, setNlpDatasets] = useState<NlpDatasetProps[]>([]);
  const [nlpDatasetId, setNlpDatasetId] = useState<number>();
  const { deactivate } = actionModalSlice.actions;
  const dispatch = useAppDispatch();
  const [deleteTextsWithoutFieldsNlpDataset, {}] =
    actionApi.useDeleteTextsWithoutFieldsNlpDatasetMutation();
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
    className: 'nlp-dataset-deleting-texts-without-fields__select',
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
    if (nlpDatasetId) deleteTextsWithoutFieldsNlpDataset(nlpDatasetId);
    dispatch(deactivate());
  };

  return (
    <div className="nlp-dataset-deleting-texts-without-fields">
      <form onSubmit={handleSubmit}>
        <div className="nlp-dataset-deleting-texts-without-fields__item">
          <LabeledElement
            className="nlp-dataset-deleting-texts-without-fields__labeled-element"
            labelElement={{
              value: t(
                'nlpDatasetDeletingTextsWithoutFields.selectNlpDataset',
                'Select dataset'
              ),
            }}
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
        <div className="nlp-dataset-deleting-texts-without-fields__item nlp-dataset-deleting-texts-without-fields__item-button">
          <InputButton className="nlp-dataset-deleting-texts-without-fields__button">
            {t('nlpDatasetDeletingTextsWithoutFields.delete', 'Delete')}
          </InputButton>
        </div>
      </form>
    </div>
  );
};

export default NlpDatasetDeletingTextsWithoutFields;

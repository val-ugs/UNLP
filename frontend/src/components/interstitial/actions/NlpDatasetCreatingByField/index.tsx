import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from 'hooks/redux';
import Select, { SelectProps } from 'components/common/Select';
import { nlpDatasetApi } from 'services/nlpDatasetService';
import { nerLabelApi } from 'services/nerLabelService';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';
import LabeledElement from 'components/interstitial/LabeledElement';
import InputButton from 'components/common/Inputs/InputButton';
import { actionApi } from 'services/actionService';
import { fieldType } from 'data/enums/fieldType';
import { enumToArray } from 'helpers/enumToArray';
import { actionModalSlice } from 'store/reducers/actionModalSlice';
import { createNlpDatasetByFieldDtoProps } from 'interfaces/dtos/createNlpDatasetByFieldDto.interface';
import { NerLabelProps } from 'interfaces/nerLabel.interface';
import { skipToken } from '@reduxjs/toolkit/query';
import InputCheckbox, {
  InputCheckboxProps,
} from 'components/common/Inputs/InputCheckbox';
import './styles.scss';

const emptyCreateNlpDatasetByFieldDto: createNlpDatasetByFieldDtoProps = {
  field: fieldType.ClassificationLabel,
  nerLabelId: undefined,
  isClassificationLabelSaved: false,
  isSummarizationSaved: false,
};

const NlpDatasetCreatingByField: FC = () => {
  const { t } = useTranslation();
  const [nlpDatasets, setNlpDatasets] = useState<NlpDatasetProps[]>([]);
  const [nlpDatasetId, setNlpDatasetId] = useState<number>();
  const [createNlpDatasetByFieldDto, setCreateNlpDatasetByFieldDto] =
    useState<createNlpDatasetByFieldDtoProps>(emptyCreateNlpDatasetByFieldDto);
  const [nerLabels, setNerLabels] = useState<NerLabelProps[]>([]);
  const { deactivate } = actionModalSlice.actions;
  const dispatch = useAppDispatch();
  const [createNlpDatasetByField, {}] =
    actionApi.useCreateNlpDatasetByFieldMutation();
  const {
    data: nlpDatasetsData,
    error: nlpDatasetError,
    isLoading: nlpDatasetLoading,
  } = nlpDatasetApi.useGetNlpDatasetsQuery();
  const {
    data: nerLabelsData,
    error: nerLabelError,
    isLoading: nerLabelLoading,
    isError: isNerLabelError,
  } = nerLabelApi.useGetNerLabelsByNlpDatasetIdQuery(nlpDatasetId ?? skipToken);

  useEffect(() => {
    if (nlpDatasetsData) setNlpDatasets(nlpDatasetsData);
  }, [nlpDatasetsData]);

  useEffect(() => {
    if (createNlpDatasetByFieldDto.field == fieldType.NerLabel && nerLabelsData)
      setNerLabels(nerLabelsData);
    if (isNerLabelError) setNerLabels([]);
  }, [createNlpDatasetByFieldDto.field, isNerLabelError, nerLabelsData]);

  const setNlpDatasetIdValue = (value: number) => {
    setNlpDatasetId(value);
  };

  const nlpDatasetSelect: SelectProps<number> = {
    className: 'nlp-dataset-creating-by-field__select',
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
    setCreateNlpDatasetByFieldDto({
      ...createNlpDatasetByFieldDto,
      field: value as fieldType,
    });
  };
  const fieldSelect: SelectProps<string> = {
    className: 'nlp-dataset-creating-by-field__select',
    selectedValue: createNlpDatasetByFieldDto.field ?? '',
    setSelectedValue: setFieldValue,
    children: enumToArray(fieldType).map((ft: fieldType) => {
      return (
        <Select.Item key={ft} value={ft}>
          {ft}
        </Select.Item>
      );
    }),
  };

  const setNerLabelIdValue = (value: number) => {
    setCreateNlpDatasetByFieldDto({
      ...createNlpDatasetByFieldDto,
      nerLabelId: value,
    });
  };
  const nerLabelSelect: SelectProps<number> = {
    className: 'nlp-dataset-creating-by-field__select',
    selectedValue: createNlpDatasetByFieldDto?.nerLabelId ?? 0,
    setSelectedValue: setNerLabelIdValue,
    children: nerLabels?.map((nerLabel: NerLabelProps) => {
      return (
        <Select.Item key={nerLabel.name} value={nerLabel.id}>
          {`${nerLabel.name}`}
        </Select.Item>
      );
    }),
  };

  const handleSubmit = () => {
    if (nlpDatasetId)
      createNlpDatasetByField({ nlpDatasetId, createNlpDatasetByFieldDto });
    dispatch(deactivate());
  };
  const handleClassificationLabelSavedChange = () => {
    setCreateNlpDatasetByFieldDto({
      ...createNlpDatasetByFieldDto,
      isClassificationLabelSaved:
        !createNlpDatasetByFieldDto.isClassificationLabelSaved,
    });
  };
  const classificationLabelSavedInputCheckbox: InputCheckboxProps = {
    className: 'nlp-dataset-creating-by-field__input-checkbox',
    name: 'classificationLabelSaved',
    checked: createNlpDatasetByFieldDto.isClassificationLabelSaved,
    onChange: handleClassificationLabelSavedChange,
  };
  const handleSummarizationSavedChange = () => {
    setCreateNlpDatasetByFieldDto({
      ...createNlpDatasetByFieldDto,
      isSummarizationSaved: !createNlpDatasetByFieldDto.isSummarizationSaved,
    });
  };
  const summarizationSavedInputCheckbox: InputCheckboxProps = {
    className: 'nlp-dataset-creating-by-field__input-checkbox',
    name: 'summarizationSaved',
    checked: createNlpDatasetByFieldDto.isSummarizationSaved,
    onChange: handleSummarizationSavedChange,
  };

  return (
    <div className="nlp-dataset-creating-by-field">
      <form onSubmit={handleSubmit}>
        <div className="nlp-dataset-creating-by-field__item">
          <LabeledElement
            className="nlp-dataset-creating-by-field__labeled-element"
            labelElement={{
              value: t(
                'nlpDatasetCreatingByField.selectNlpDataset',
                'Select nlp dataset'
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
        <div className="nlp-dataset-creating-by-field__item">
          <LabeledElement
            className="nlp-dataset-creating-by-field__labeled-element"
            labelElement={{
              value: t('nlpDatasetCreatingByField.selectField', 'Select field'),
            }}
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
        {createNlpDatasetByFieldDto.field == fieldType.NerLabel && (
          <div className="nlp-dataset-creating-by-field__item">
            <LabeledElement
              className="nlp-dataset-creating-by-field__labeled-element"
              labelElement={{
                value: t(
                  'nlpDatasetCreatingByField.selectNerLabel',
                  'Select NER label'
                ),
              }}
            >
              <Select
                className={nerLabelSelect.className}
                selectedValue={nerLabelSelect.selectedValue}
                setSelectedValue={nerLabelSelect.setSelectedValue}
                disabled={nerLabelSelect.disabled}
              >
                {nerLabelSelect.children}
              </Select>
            </LabeledElement>
          </div>
        )}
        <div className="nlp-dataset-creating-by-field__input-checkbox">
          <LabeledElement
            className="nlp-dataset-creating-by-field__labeled-element"
            labelElement={{
              value: t(
                'nlpDatasetCreatingByField.isClassificationLabelSaved',
                'Is classification label saved'
              ),
            }}
          >
            <InputCheckbox
              className={classificationLabelSavedInputCheckbox.className}
              name={classificationLabelSavedInputCheckbox.name}
              checked={classificationLabelSavedInputCheckbox.checked}
              onChange={classificationLabelSavedInputCheckbox.onChange}
            />
          </LabeledElement>
        </div>
        <div className="nlp-dataset-creating-by-field__input-checkbox">
          <LabeledElement
            className="nlp-dataset-creating-by-field__labeled-element"
            labelElement={{
              value: t(
                'nlpDatasetCreatingByField.isSummarizationSaved',
                'Is summarization saved'
              ),
            }}
          >
            <InputCheckbox
              className={summarizationSavedInputCheckbox.className}
              name={summarizationSavedInputCheckbox.name}
              checked={summarizationSavedInputCheckbox.checked}
              onChange={summarizationSavedInputCheckbox.onChange}
            />
          </LabeledElement>
        </div>

        <div className="nlp-dataset-creating-by-field__item nlp-dataset-creating-by-field__item-button">
          <InputButton className="nlp-dataset-creating__button">
            {t('nlpDatasetCreatingByField.create', 'Create')}
          </InputButton>
        </div>
      </form>
    </div>
  );
};

export default NlpDatasetCreatingByField;

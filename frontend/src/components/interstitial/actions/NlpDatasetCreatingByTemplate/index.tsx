import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from 'hooks/redux';
import { nlpDatasetApi } from 'services/nlpDatasetService';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';
import LabeledElement from 'components/interstitial/LabeledElement';
import InputButton from 'components/common/Inputs/InputButton';
import { actionApi } from 'services/actionService';
import { actionModalSlice } from 'store/reducers/actionModalSlice';
import './styles.scss';
import Multiselect, { MultiselectProps } from 'components/common/Multiselect';
import { CreateNlpDatasetByTemplateDtoProps } from 'interfaces/dtos/createNlpDatasetByTemplateDto';
import InputField, {
  InputFieldProps,
} from 'components/common/Inputs/InputField';
import TextareaField, {
  TextareaFieldProps,
} from 'components/common/Inputs/TextareaField';

const emptyCreateNlpDatasetByTemplateDto: CreateNlpDatasetByTemplateDtoProps = {
  nlpDatasets: [],
  template: '',
  delimiter: '',
};

const NlpDatasetCreatingByTemplate: FC = () => {
  const { t } = useTranslation();
  const [nlpDatasets, setNlpDatasets] = useState<NlpDatasetProps[]>([]);
  const [createNlpDatasetByTemplateDto, setCreateNlpDatasetByTemplateDto] =
    useState<CreateNlpDatasetByTemplateDtoProps>(
      emptyCreateNlpDatasetByTemplateDto
    );
  const { deactivate } = actionModalSlice.actions;
  const dispatch = useAppDispatch();
  const [createNlpDatasetByTemplate, {}] =
    actionApi.useCreateNlpDatasetByTemplateMutation();
  const {
    data: nlpDatasetsData,
    error,
    isLoading,
  } = nlpDatasetApi.useGetNlpDatasetsQuery();

  useEffect(() => {
    if (nlpDatasetsData) setNlpDatasets(nlpDatasetsData);
  }, [nlpDatasetsData]);

  const setNlpDatasetValues = (values: number[]) => {
    setCreateNlpDatasetByTemplateDto({
      ...createNlpDatasetByTemplateDto,
      nlpDatasets: nlpDatasets?.filter((nd) => values.includes(nd.id)) ?? [],
    });
  };
  const nlpDatasetMultiselect: MultiselectProps<number> = {
    className: 'nlp-dataset-creating-by-template',
    selectedValues:
      createNlpDatasetByTemplateDto?.nlpDatasets.map((nd) => nd.id) ?? [],
    setSelectedValues: setNlpDatasetValues,
    children:
      nlpDatasets?.map((nlpDataset: NlpDatasetProps) => (
        <Multiselect.Item key={nlpDataset.id} value={nlpDataset.id}>
          Dataset {nlpDataset.id}
        </Multiselect.Item>
      )) ?? '',
  };

  const setTemplateValue = (value: string) => {
    setCreateNlpDatasetByTemplateDto({
      ...createNlpDatasetByTemplateDto,
      template: value,
    });
  };
  const templateTextareaField: TextareaFieldProps = {
    className: 'nlp-dataset-creating-by-template__textarea-field',
    name: 'template',
    value: createNlpDatasetByTemplateDto.template ?? '',
    setValue: setTemplateValue,
    maxLength: 500,
  };

  const setDelimiterValue = (value: string) => {
    setCreateNlpDatasetByTemplateDto({
      ...createNlpDatasetByTemplateDto,
      delimiter: value,
    });
  };
  const delimiterInputField: InputFieldProps = {
    className: 'nlp-dataset-creating-by-template__input-field nodrag nowheel',
    type: 'text',
    name: 'delimiter',
    value: createNlpDatasetByTemplateDto.delimiter ?? '',
    setValue: setDelimiterValue,
    maxLength: 1,
    disabled: false,
  };

  const handleSubmit = () => {
    if (createNlpDatasetByTemplateDto.nlpDatasets?.length > 0)
      createNlpDatasetByTemplate(createNlpDatasetByTemplateDto);
    dispatch(deactivate());
  };

  return (
    <div className="nlp-dataset-creating-by-template">
      <form onSubmit={handleSubmit}>
        <div className="nlp-dataset-creating-by-template__item">
          <LabeledElement
            className="nlp-dataset-creating-by-template__labeled-element"
            labelElement={{
              value: t(
                'nlpDatasetCreatingByTemplate.selectNlpDatasets',
                'Select datasets'
              ),
            }}
          >
            <Multiselect
              className={nlpDatasetMultiselect.className}
              selectedValues={nlpDatasetMultiselect.selectedValues}
              setSelectedValues={nlpDatasetMultiselect.setSelectedValues}
              maxLength={nlpDatasetMultiselect.maxLength}
              disabled={nlpDatasetMultiselect.disabled}
            >
              {nlpDatasetMultiselect.children}
            </Multiselect>
          </LabeledElement>
        </div>
        <div className="nlp-dataset-creating-by-template__item">
          <LabeledElement
            className="nlp-dataset-creating-by-template__labeled-element"
            labelElement={{
              value: t(
                'nlpDatasetCreatingByTemplate.inputTemplate',
                'Input template'
              ),
            }}
          >
            <TextareaField
              className={templateTextareaField.className}
              name={templateTextareaField.name}
              form={templateTextareaField.form}
              value={templateTextareaField.value}
              setValue={templateTextareaField.setValue}
              rows={templateTextareaField.rows}
              maxLength={templateTextareaField.maxLength}
              placeholder={templateTextareaField.placeholder}
              disabled={templateTextareaField.disabled}
              readonly={templateTextareaField.readonly}
            />
          </LabeledElement>
        </div>
        <div className="nlp-dataset-creating-by-template__item">
          <LabeledElement
            className="nlp-dataset-creating-by-template__labeled-element"
            labelElement={{
              value: t(
                'nlpDatasetCreatingByTemplate.inputDelimiter',
                'Input delimiter'
              ),
            }}
          >
            <InputField
              className={delimiterInputField.className}
              type={delimiterInputField.type}
              name={delimiterInputField.name}
              value={delimiterInputField.value}
              setValue={delimiterInputField.setValue}
              maxLength={delimiterInputField.maxLength}
              placeholder={delimiterInputField.placeholder}
              disabled={delimiterInputField.disabled}
              autocomplete={delimiterInputField.autocomplete}
            />
          </LabeledElement>
        </div>
        <div className="nlp-dataset-creating-by-template__item nlp-dataset-creating-by-template__item-button">
          <InputButton className="nlp-dataset-creating-by-template__button">
            {t('nlpDatasetCreatingByTemplate.submit', 'Submit')}
          </InputButton>
        </div>
      </form>
    </div>
  );
};

export default NlpDatasetCreatingByTemplate;

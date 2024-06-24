import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from 'hooks/redux';
import LabeledElement from 'components/interstitial/LabeledElement';
import InputButton from 'components/common/Inputs/InputButton';
import { actionApi } from 'services/actionService';
import { actionModalSlice } from 'store/reducers/actionModalSlice';
import './styles.scss';
import { LoadNlpDatasetDtoProps } from 'interfaces/dtos/loadNlpDatasetDto.interface';
import InputField, {
  InputFieldProps,
} from 'components/common/Inputs/InputField';

const emptyLoadDatasetDto: LoadNlpDatasetDtoProps = {
  filePath: '',
  textPatternToSplit: '',
};

const NlpDatasetLoading: FC = () => {
  const { t } = useTranslation();
  const [loadNlpDatasetDto, setLoadNlpDatasetDto] =
    useState<LoadNlpDatasetDtoProps>(emptyLoadDatasetDto);
  const { deactivate } = actionModalSlice.actions;
  const dispatch = useAppDispatch();
  const [loadNlpDataset, {}] = actionApi.useLoadNlpDatasetMutation();

  const setFilePathValue = (value: string) => {
    setLoadNlpDatasetDto({
      ...loadNlpDatasetDto,
      filePath: value,
    });
  };
  const filePathInputField: InputFieldProps = {
    className: 'nlp-dataset-loading__input-field nodrag nowheel',
    type: 'text',
    name: 'filePath',
    value: loadNlpDatasetDto.textPatternToSplit ?? '',
    setValue: setFilePathValue,
    maxLength: 1,
    disabled: false,
  };

  const setTextPatternToSplitValue = (value: string) => {
    setLoadNlpDatasetDto({
      ...loadNlpDatasetDto,
      textPatternToSplit: value,
    });
  };
  const textPatternToSplitInputField: InputFieldProps = {
    className: 'nlp-dataset-loading__input-field nodrag nowheel',
    type: 'text',
    name: 'textPatternToSplit',
    value: loadNlpDatasetDto.textPatternToSplit ?? '',
    setValue: setTextPatternToSplitValue,
    maxLength: 1,
    disabled: false,
  };

  const handleSubmit = () => {
    loadNlpDataset(loadNlpDatasetDto);
    dispatch(deactivate());
  };

  return (
    <div className="nlp-dataset-loading">
      <form onSubmit={handleSubmit}>
        <div className="nlp-dataset-loading__item">
          <LabeledElement
            className="nlp-dataset-loading__labeled-element"
            labelElement={{
              value: t('nlpDatasetLoading.inputFilePath', 'Input file path'),
            }}
          >
            <InputField
              className={filePathInputField.className}
              type={filePathInputField.type}
              name={filePathInputField.name}
              value={filePathInputField.value}
              setValue={filePathInputField.setValue}
              maxLength={filePathInputField.maxLength}
              placeholder={filePathInputField.placeholder}
              disabled={filePathInputField.disabled}
              autocomplete={filePathInputField.autocomplete}
            />
          </LabeledElement>
        </div>
        <div className="nlp-dataset-loading__item">
          <LabeledElement
            className="nlp-dataset-loading__labeled-element"
            labelElement={{
              value: t(
                'nlpDatasetLoading.inputTextPatternToSplit',
                'Input text pattern to split'
              ),
            }}
          >
            <InputField
              className={textPatternToSplitInputField.className}
              type={textPatternToSplitInputField.type}
              name={textPatternToSplitInputField.name}
              value={textPatternToSplitInputField.value}
              setValue={textPatternToSplitInputField.setValue}
              maxLength={textPatternToSplitInputField.maxLength}
              placeholder={textPatternToSplitInputField.placeholder}
              disabled={textPatternToSplitInputField.disabled}
              autocomplete={textPatternToSplitInputField.autocomplete}
            />
          </LabeledElement>
        </div>
        <div className="nlp-dataset-loading__item nlp-dataset-loading__item-button">
          <InputButton className="nlp-dataset-loading__button">
            {t('nlpDatasetLoading.submit', 'Submit')}
          </InputButton>
        </div>
      </form>
    </div>
  );
};

export default NlpDatasetLoading;

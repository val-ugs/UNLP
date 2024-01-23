import React, { ChangeEvent, FC, FormEvent, useId, useState } from 'react';
import { nlpDatasetApi } from 'services/nlpDatasetService';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { loadDataModalSlice } from 'store/reducers/loadDataModalSlice';
import { nlpDatasetSlice } from 'store/reducers/nlpDatasetSlice';
import ContentModal from 'components/interstitial/ContentModal';
import LabeledElement from 'components/interstitial/LabeledElement';
import InputButton from 'components/common/Inputs/InputButton';
import InputField, {
  InputFieldProps,
} from 'components/common/Inputs/InputField';
import { LoadingDataDtoProps } from 'interfaces/dtos/loadingDataDto.interface';
import './styles.scss';

const emptyLoadingDataDto: LoadingDataDtoProps = {
  file: undefined,
  textPatternToSplit: '',
};

const LoadDataModal: FC = () => {
  const [loadingDataDto, setLoadingDataDto] =
    useState<LoadingDataDtoProps>(emptyLoadingDataDto);
  const loadDataId = useId();
  const [postNlpDataset, {}] = nlpDatasetApi.usePostNlpDatasetMutation();
  const { isActive } = useAppSelector((state) => state.loadDataModalReducer);
  const { deactivate } = loadDataModalSlice.actions;
  const { setNlpDatasetId } = nlpDatasetSlice.actions;
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(deactivate());
  };

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setLoadingDataDto({ ...loadingDataDto, file: e.target.files[0] });
    }
  };

  const setPatternValue = (value: string) => {
    setLoadingDataDto({ ...loadingDataDto, textPatternToSplit: value });
  };
  const patternInputField: InputFieldProps = {
    className: `load-data-modal__input-field `,
    type: 'text',
    name: 'pattern',
    value: loadingDataDto.textPatternToSplit,
    setValue: setPatternValue,
    maxLength: 30,
    disabled:
      loadingDataDto.file && !loadingDataDto.file.name.endsWith('.json')
        ? false
        : true,
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const nlpDataset = await postNlpDataset(loadingDataDto).unwrap();
      dispatch(setNlpDatasetId(nlpDataset.id));
    } catch (error) {
      console.log(error);
    }

    dispatch(deactivate());
  };

  return (
    <ContentModal
      className="load-data-modal"
      title={'Load data'}
      isActive={isActive}
      handleClose={handleClose}
    >
      <form className="load-data-modal__form" onSubmit={handleSubmit}>
        <div className="load-data-modal__field">
          <label className="load-data-modal__label" htmlFor={loadDataId}>
            <input
              type="file"
              accept=".txt, .json"
              id={loadDataId}
              onChange={handleFile}
              hidden
            />
            Load txt or json file
          </label>
          <div className="load-data-modal__path">
            {loadingDataDto.file ? loadingDataDto.file.name : 'Файл не выбран'}
          </div>
        </div>
        <div className="load-data-modal__field">
          <LabeledElement
            labelElement={{ value: 'Regex text pattern to split' }}
          >
            <InputField
              className={patternInputField.className}
              type={patternInputField.type}
              name={patternInputField.name}
              value={patternInputField.value}
              setValue={patternInputField.setValue}
              maxLength={patternInputField.maxLength}
              placeholder={patternInputField.placeholder}
              disabled={patternInputField.disabled}
              autocomplete={patternInputField.autocomplete}
            />
          </LabeledElement>
        </div>
        <div className="load-data-modal__field load-data-modal__field-button">
          <InputButton
            className="load-data-modal__button"
            disabled={loadingDataDto.file ? false : true}
          >
            Load data
          </InputButton>
        </div>
      </form>
    </ContentModal>
  );
};

export default LoadDataModal;

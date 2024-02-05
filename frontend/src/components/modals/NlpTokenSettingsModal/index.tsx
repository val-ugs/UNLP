import React, { FC, FormEvent, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import ContentModal from 'components/interstitial/ContentModal';
import InputButton from 'components/common/Inputs/InputButton';
import InputField, {
  InputFieldProps,
} from 'components/common/Inputs/InputField';
import { nlpTokenSettingsModalSlice } from 'store/reducers/nlpTokenSettingsModalSlice';
import LabeledElement from 'components/interstitial/LabeledElement';
import { nlpDatasetApi } from 'services/nlpDatasetService';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';
import './styles.scss';

export interface NlpTokenSettingsModalProps {
  className?: string;
}

const NlpTokenSettingsModal: FC<NlpTokenSettingsModalProps> = ({
  className,
}) => {
  const [nlpDataset, setNlpDataset] = React.useState<
    NlpDatasetProps | undefined
  >(undefined);
  const [putNlpDataset, {}] = nlpDatasetApi.usePutNlpDatasetMutation();
  const { isActive, nlpDataset: nlpDatasetData } = useAppSelector(
    (state) => state.nlpTokenSettingsModalReducer
  );
  const { deactivate } = nlpTokenSettingsModalSlice.actions;
  const dispatch = useAppDispatch();

  useEffect(() => {
    setNlpDataset(nlpDatasetData);
  }, [nlpDatasetData]);

  const setTokenPatternToRemove = (value: string) => {
    if (nlpDataset)
      setNlpDataset({ ...nlpDataset, tokenPatternToRemove: value });
  };
  const patternToRemoveInputField: InputFieldProps = {
    className: 'nlp-token-settings-modal__pattern-to-remove',
    type: 'text',
    name: 'tokenPatternToRemove',
    value: nlpDataset?.tokenPatternToRemove ?? '',
    setValue: setTokenPatternToRemove,
    maxLength: 20,
    disabled: false,
  };

  const setTokenPatternToSplit = (value: string) => {
    if (nlpDataset)
      setNlpDataset({ ...nlpDataset, tokenPatternToSplit: value });
  };
  const patternToSplitInputField: InputFieldProps = {
    className: 'nlp-token-settings-modal__pattern-to-split',
    type: 'text',
    name: 'tokenPatternToSplit',
    value: nlpDataset?.tokenPatternToSplit ?? '',
    setValue: setTokenPatternToSplit,
    maxLength: 20,
    disabled: false,
  };

  const handleClose = () => {
    dispatch(deactivate());
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (nlpDataset) await putNlpDataset(nlpDataset).unwrap();
    } catch (error) {
      console.log(error);
    }

    dispatch(deactivate());
  };

  return (
    <ContentModal
      className={`nlp-token-settings-modal ${className}`}
      title={'Nlp token settings'}
      isActive={isActive}
      handleClose={handleClose}
    >
      <div className="nlp-token-settings-modal__warning">
        When changing token settings, NER labels will be removed.
      </div>
      <form className="nlp-token-settings-modal__form" onSubmit={handleSubmit}>
        <LabeledElement
          className="nlp-token-settings-modal__item"
          labelElement={{ value: 'Pattern to remove' }}
        >
          <InputField
            className={patternToRemoveInputField.className}
            type={patternToRemoveInputField.type}
            name={patternToRemoveInputField.name}
            value={patternToRemoveInputField.value}
            setValue={patternToRemoveInputField.setValue}
            maxLength={patternToRemoveInputField.maxLength}
            placeholder={patternToRemoveInputField.placeholder}
            disabled={patternToRemoveInputField.disabled}
            autocomplete={patternToRemoveInputField.autocomplete}
          />
        </LabeledElement>
        <LabeledElement
          className="nlp-token-settings-modal__item"
          labelElement={{ value: 'Pattern to split' }}
        >
          <InputField
            className={patternToSplitInputField.className}
            type={patternToSplitInputField.type}
            name={patternToSplitInputField.name}
            value={patternToSplitInputField.value}
            setValue={patternToSplitInputField.setValue}
            maxLength={patternToSplitInputField.maxLength}
            placeholder={patternToSplitInputField.placeholder}
            disabled={patternToSplitInputField.disabled}
            autocomplete={patternToSplitInputField.autocomplete}
          />
        </LabeledElement>
        <div className="nlp-token-settings-modal__button">
          <InputButton className="nlp-token-settings-modal__button">
            Confirm
          </InputButton>
        </div>
      </form>
    </ContentModal>
  );
};

export default NlpTokenSettingsModal;

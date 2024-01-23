import React, { ChangeEvent, FC, useEffect, MouseEvent, useState } from 'react';
import camelize from 'camelize';
import snakeize from 'snakeize';
import { useAppDispatch } from 'hooks/redux';
import useStateRef from 'hooks/useStateRef';
import { nlpTextApi } from 'services/nlpTextService';
import LabeledElement from 'components/interstitial/LabeledElement';
import InputField, {
  InputFieldProps,
} from 'components/common/Inputs/InputField';
import Accordion from 'components/common/Accordion';
import NlpTokenItem from './components/NlpTokens/components/NlpTokenItem';
import { NlpTextProps } from 'interfaces/nlpText.interface';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';
import Button from 'components/common/Button';
import { nlpTokenSettingsModalSlice } from 'store/reducers/nlpTokenSettingsModalSlice';
import gear from 'images/icons/gear.svg';
import { NerLabelProps } from 'interfaces/nerLabel.interface';
import { nerLabelApi } from 'services/nerLabelService';
import NlpTokens from './components/NlpTokens';
import './styles.scss';

export interface NlpTextFormProps {
  className: string;
  selectedNlpTextId: number;
  nlpDataset: NlpDatasetProps;
}

const NlpTextForm: FC<NlpTextFormProps> = ({
  className,
  selectedNlpTextId,
  nlpDataset,
}) => {
  const [nlpText, setNlpText, nlpTextRef] = useStateRef<
    NlpTextProps | undefined
  >(undefined);
  const [nerLabels, setNerLabels] = useState<NerLabelProps[]>([]);
  const {
    data: nlpTextData,
    error: nlpTextError,
    isLoading: nlpTextLoading,
  } = nlpTextApi.useGetNlpTextByIdQuery(Number(selectedNlpTextId));
  const {
    data: nerLabelsData,
    error: nerLabelsError,
    isLoading: nerLabelsLoading,
  } = nerLabelApi.useGetNerLabelsByNlpDatasetIdQuery(Number(nlpDataset.id));
  const [updateNlpText, {}] = nlpTextApi.usePutNlpTextMutation();
  const { activate } = nlpTokenSettingsModalSlice.actions;
  const dispatch = useAppDispatch();

  useEffect(() => {
    setNlpText(camelize(nlpTextData));
  }, [nlpTextData]);

  useEffect(() => {
    setNerLabels(camelize(nerLabelsData));
  }, [nerLabelsData]);

  const setClassificationLabel = (value: string) => {
    setNlpText({ ...nlpText!, classificationLabel: value });
  };

  const classificationLabelInputField: InputFieldProps = {
    className: `text-nlp-form__up-input `,
    type: 'text',
    name: 'nlp-text',
    value: nlpText?.classificationLabel ?? '',
    setValue: setClassificationLabel,
    maxLength: 30,
    disabled: false,
  };

  const setText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNlpText({ ...nlpText!, text: e.target.value });
  };

  useEffect(() => {
    if (nlpText && selectedNlpTextId != nlpText.id)
      updateNlpText(snakeize(nlpText));
  }, [selectedNlpTextId]);

  useEffect(() => {
    // when leave the component, call the function
    return () => {
      if (nlpTextRef.current) updateNlpText(snakeize(nlpTextRef.current));
    };
  }, []);

  const handleOpenNlpTokenSettings = () => {
    dispatch(activate(nlpDataset));
  };

  return (
    <div className={`nlp-text-form ${className}`}>
      <>
        <div className="nlp-text-form__fields">
          <LabeledElement
            className="nlp-text-form__fields-labeled-element"
            labelElement={{
              className: 'nlp-text-form__fields-label',
              value: 'Classification label',
            }}
          >
            <InputField
              className={classificationLabelInputField.className}
              type={classificationLabelInputField.type}
              name={classificationLabelInputField.name}
              value={classificationLabelInputField.value}
              setValue={classificationLabelInputField.setValue}
              maxLength={classificationLabelInputField.maxLength}
              placeholder={classificationLabelInputField.placeholder}
              disabled={classificationLabelInputField.disabled}
              autocomplete={classificationLabelInputField.autocomplete}
            />
          </LabeledElement>
        </div>
        <div className="nlp-text-form__item nlp-text-form__text">
          <Accordion
            className="nlp-text-form__accordion nlp-text-form__text-accordion"
            header={'Text:'}
          >
            <textarea
              className="nlp-text-form__text-textarea"
              value={nlpText?.text}
              onChange={setText}
            />
          </Accordion>
        </div>
        <div className="nlp-text-form__item nlp-text-form__tokens-settings">
          <Button
            className="nlp-text-form__tokens-settings-button"
            onClick={handleOpenNlpTokenSettings}
          >
            Token Settings
          </Button>
        </div>
        <div className="nlp-text-form__item">
          <NlpTokens
            className="nlp-text-form__tokens"
            nlpTextId={selectedNlpTextId}
            nerLabels={nerLabels}
          />
        </div>
      </>
    </div>
  );
};

export default NlpTextForm;

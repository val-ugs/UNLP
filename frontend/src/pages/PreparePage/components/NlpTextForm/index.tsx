import React, { ChangeEvent, FC, useEffect } from 'react';
import camelize from 'camelize';
import snakeize from 'snakeize';
import useStateRef from 'hooks/useStateRef';
import { nlpTextApi } from 'services/nlpTextService';
import LabeledElement from 'components/interstitial/LabeledElement';
import InputField, {
  InputFieldProps,
} from 'components/common/Inputs/InputField';
import Accordion from 'components/common/Accordion';
import NlpTokenItem from './components/NlpTokenItem';
import { NlpTextProps } from 'interfaces/nlpText.interface';
import './styles.scss';
import { NerLabelProps } from 'interfaces/nerLabel.interface';

export interface NlpTextFormProps {
  className: string;
  selectedNlpTextId: number;
  nerLabels: NerLabelProps[];
}

const NlpTextForm: FC<NlpTextFormProps> = ({
  className,
  selectedNlpTextId,
  nerLabels,
}) => {
  const [nlpText, setNlpText, nlpTextRef] = useStateRef<
    NlpTextProps | undefined
  >(undefined);
  const {
    data: nlpTextData,
    error,
    isLoading,
  } = nlpTextApi.useGetNlpTextByIdQuery(Number(selectedNlpTextId));
  const [updateNlpText, {}] = nlpTextApi.usePutNlpTextMutation();

  useEffect(() => {
    setNlpText(camelize(nlpTextData));
  }, [nlpTextData]);

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
        <div className="nlp-text-form__text">
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
        <div className="nlp-text-form__tokens">
          <Accordion
            className="nlp-text-form__accordion nlp-text-form__tokens-accordion"
            header={'Tokens:'}
          >
            <div className="nlp-text-form__tokens-area">
              {nlpText?.nlpTokens
                ? nlpText.nlpTokens.map((nlpToken) => (
                    <NlpTokenItem
                      className="nlp-text-form__tokens-item"
                      key={nlpToken.pos}
                      nlpToken={nlpToken}
                      nerLabels={nerLabels}
                    />
                  ))
                : 'Токены не найдены. Проверьте настройки.'}
            </div>
          </Accordion>
        </div>
      </>
    </div>
  );
};

export default NlpTextForm;

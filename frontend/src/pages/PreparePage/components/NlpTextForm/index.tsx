import React, { ChangeEvent, FC, useEffect } from 'react';
import camelize from 'camelize';
import snakeize from 'snakeize';
import useStateRef from 'hooks/useStateRef';
import { nlpTextApi } from 'services/nlpTextService';
import LabeledElement from 'components/interstitial/LabeledElement';
import InputField, {
  InputFieldProps,
} from 'components/common/Inputs/InputField';
import { NlpTextProps } from 'interfaces/nlpText.interface';
import './styles.scss';

export interface NlpTextFormProps {
  className: string;
  selectedNlpTextId: number;
}

const NlpTextForm: FC<NlpTextFormProps> = ({
  className,
  selectedNlpTextId,
}) => {
  const [nlpText, setNlpText, nlpTextRef] = useStateRef<
    NlpTextProps | undefined
  >(undefined);
  const {
    data: nlpTextData,
    error,
    isLoading,
  } = nlpTextApi.useFetchNlpTextByIdQuery(Number(selectedNlpTextId));
  const [updateNlpText, {}] = nlpTextApi.useUpdateNlpTextMutation();

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
    <div className={`text-nlp-form ${className}`}>
      <>
        <div className="text-nlp-form__up">
          <LabeledElement
            className="text-nlp-form__up-labeled-element"
            labelElement={{
              className: 'text-nlp-form__up-label',
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
        <div className="text-nlp-form__down">
          <textarea
            className="text-nlp-form__textarea"
            value={nlpText?.text}
            onChange={setText}
          />
        </div>
      </>
    </div>
  );
};

export default NlpTextForm;

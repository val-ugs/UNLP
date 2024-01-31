import React, { FC, useState } from 'react';
import Button from 'components/common/Button';
import { enumToArray } from 'helpers/enumToArray';
import LabeledElement from 'components/interstitial/LabeledElement';
import InputField, {
  InputFieldProps,
} from 'components/common/Inputs/InputField';
import './styles.scss';

enum NlpModelType {
  Classification,
  Ner,
}

const PrepareNlpModel: FC = () => {
  const [selectedNlpModelType, setSelectedNlpModelType] =
    useState<NlpModelType>();
  const [model, setModel] = useState<string>('');

  const modelInputField: InputFieldProps = {
    className: `prepare-nlp-model__model-input-field `,
    type: 'text',
    name: 'model',
    value: model,
    setValue: setModel,
    maxLength: 30,
  };

  return (
    <div className="prepare-nlp-model">
      <div className="prepare-nlp-model__type">
        {enumToArray(NlpModelType).map((nlpModelType: NlpModelType) => (
          <Button
            className="prepare-nlp-model__type-button"
            onClick={() => {
              setSelectedNlpModelType(nlpModelType);
            }}
            key={nlpModelType}
          >
            {nlpModelType}
          </Button>
        ))}
      </div>
      <LabeledElement
        className="prepare-nlp-model__model"
        labelElement={{ value: 'Select model or model path' }}
      >
        <InputField
          className={modelInputField.className}
          type={modelInputField.type}
          name={modelInputField.name}
          value={modelInputField.value}
          setValue={modelInputField.setValue}
          maxLength={modelInputField.maxLength}
          placeholder={modelInputField.placeholder}
          disabled={modelInputField.disabled}
          autocomplete={modelInputField.autocomplete}
        />
      </LabeledElement>
      <div className="prepare-nlp-model__training-args"></div>
    </div>
  );
};

export default PrepareNlpModel;

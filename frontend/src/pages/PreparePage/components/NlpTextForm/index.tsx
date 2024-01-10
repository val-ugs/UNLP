import React, { ChangeEvent, FC } from 'react';
import { NlpTextProps } from 'interfaces/nlpText.interface';
import LabeledElement from 'components/interstitial/LabeledElement';
import './styles.scss';

export interface NlpTextFormProps {
  className: string;
  nlpText: NlpTextProps;
  setNlpText: (nlpText: NlpTextProps) => void;
}

const NlpTextForm: FC<NlpTextFormProps> = ({
  className,
  nlpText,
  setNlpText,
}) => {
  const setTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setNlpText({ ...nlpText, title: e.target.value });
  };

  const setText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNlpText({ ...nlpText, text: e.target.value });
  };

  return (
    <div className={`text-nlp-form ${className}`}>
      <div className="text-nlp-form__up">
        <LabeledElement labelElement={{ value: 'Title' }}>
          <input value={nlpText.title} onChange={setTitle} />
        </LabeledElement>
      </div>
      <div className="text-nlp-form__down">
        <textarea
          className="text-nlp-form__textarea"
          value={nlpText.text}
          onChange={setText}
        />
      </div>
    </div>
  );
};

export default NlpTextForm;

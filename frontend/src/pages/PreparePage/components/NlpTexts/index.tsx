import React, { FC } from 'react';
import { NlpTextProps } from 'interfaces/nlpText.interface';
import Button from 'components/common/Button';
import './styles.scss';

export interface NlpTextsProps {
  className: string;
  nlpTexts: NlpTextProps[];
  selectedNlpText: NlpTextProps;
  setSelectedNlpText: (nlpText: NlpTextProps) => void;
}

const NlpTexts: FC<NlpTextsProps> = ({
  className,
  nlpTexts,
  selectedNlpText,
  setSelectedNlpText,
}) => {
  return (
    <div className={`nlp-texts ${className}`}>
      <div className="nlp-texts__title">Texts:</div>
      <div className="nlp-texts__list">
        {nlpTexts?.map((nlpText: NlpTextProps) => (
          <Button
            className={`nlp-texts__item ${
              selectedNlpText.id == nlpText.id ? 'active' : ''
            }`}
            onClick={() => setSelectedNlpText(nlpText)}
            key={nlpText.id}
          >
            {nlpText.text}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default NlpTexts;

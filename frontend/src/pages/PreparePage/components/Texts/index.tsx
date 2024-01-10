import React, { FC } from 'react';
import { NlpTextProps } from 'interfaces/nlpText.interface';
import Button from 'components/common/Button';
import './styles.scss';

export interface TextsProps {
  className: string;
  nlpTexts: NlpTextProps[];
  selectedNlpText: NlpTextProps;
  setSelectedNlpText: (nlpText: NlpTextProps) => void;
}

const Texts: FC<TextsProps> = ({
  className,
  nlpTexts,
  selectedNlpText,
  setSelectedNlpText,
}) => {
  return (
    <div className={`texts ${className}`}>
      <div className="texts__title">Texts:</div>
      <div className="texts__list">
        {nlpTexts?.map((nlpText: NlpTextProps) => (
          <Button
            className={`texts__item ${
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

export default Texts;

import React, { FC } from 'react';
import Button from 'components/common/Button';
import { NlpTextProps } from 'interfaces/nlpText.interface';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';
import './styles.scss';

export interface NlpTextsProps {
  className: string;
  nlpDataset: NlpDatasetProps | undefined;
  selectedNlpTextId: number | undefined;
  setSelectedNlpTextId: (id: number) => void;
}

const NlpTexts: FC<NlpTextsProps> = ({
  className,
  nlpDataset,
  selectedNlpTextId,
  setSelectedNlpTextId,
}) => {
  return (
    <div className={`nlp-texts ${className}`}>
      <div className="nlp-texts__title">Texts:</div>
      <div className="nlp-texts__list">
        {nlpDataset?.nlpTexts.map((nlpText: NlpTextProps) => (
          <Button
            className={`nlp-texts__item ${
              selectedNlpTextId == nlpText.id ? 'active' : ''
            }`}
            onClick={() => setSelectedNlpTextId(nlpText.id)}
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

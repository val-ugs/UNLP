import React, { FC, useEffect } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';
import Button from 'components/common/Button';
import { NlpTextProps } from 'interfaces/nlpText.interface';
import './styles.scss';
import { nlpTextApi } from 'services/nlpTextService';

export interface NlpTextsProps {
  className: string;
  nlpDatasetId: number | undefined;
  selectedNlpTextId: number | undefined;
  setSelectedNlpTextId: (id: number) => void;
}

const NlpTexts: FC<NlpTextsProps> = ({
  className,
  nlpDatasetId,
  selectedNlpTextId,
  setSelectedNlpTextId,
}) => {
  const {
    data: nlpTexts,
    error,
    isLoading,
  } = nlpTextApi.useGetNlpTextsByNlpDatasetIdQuery(
    nlpDatasetId ? Number(nlpDatasetId) : skipToken
  );

  useEffect(() => {
    if (nlpTexts)
      selectedNlpTextId
        ? setSelectedNlpTextId(selectedNlpTextId)
        : setSelectedNlpTextId(nlpTexts[0].id);
  }, [nlpTexts]);

  return (
    <div className={`nlp-texts ${className}`}>
      <div className="nlp-texts__title">Texts:</div>
      <div className="nlp-texts__list">
        {nlpTexts?.map((nlpText: NlpTextProps) => (
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

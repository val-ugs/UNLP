import React, { FC, useState, useEffect } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';
import Button from 'components/common/Button';
import { NlpTextProps } from 'interfaces/nlpText.interface';
import { nlpTextApi } from 'services/nlpTextService';
import './styles.scss';

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
  const [nlpTexts, setNlpTexts] = useState<NlpTextProps[]>([]);
  const {
    data: nlpTextsData,
    isLoading,
    isError,
  } = nlpTextApi.useGetNlpTextsByNlpDatasetIdQuery(
    nlpDatasetId ? Number(nlpDatasetId) : skipToken
  );
  const [deleteNlpText, {}] = nlpTextApi.useDeleteNlpTextMutation();

  useEffect(() => {
    if (nlpTextsData && !isError) {
      setNlpTexts(nlpTextsData);
      selectedNlpTextId
        ? setSelectedNlpTextId(selectedNlpTextId)
        : setSelectedNlpTextId(nlpTextsData[0].id);
    }
  }, [nlpTextsData, nlpDatasetId]);

  const handleDelete = () => {
    if (selectedNlpTextId) deleteNlpText(selectedNlpTextId);

    if (nlpTexts && nlpTexts.length > 1) {
      const deletedNlpText = nlpTexts.find(
        (nlpText) => nlpText.id === selectedNlpTextId
      );
      if (deletedNlpText) {
        const deletedNlpTextIndex = nlpTexts.indexOf(deletedNlpText);
        setSelectedNlpTextId(
          nlpTexts[
            deletedNlpTextIndex > 0
              ? deletedNlpTextIndex - 1
              : deletedNlpTextIndex + 1
          ].id
        );
      }
    } else setNlpTexts([]);
  };

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
      <div className="nlp-texts__bottom">
        <div className="nlp-texts__delete">
          <Button className="nlp-texts__delete-button" onClick={handleDelete}>
            Delete selected text
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NlpTexts;

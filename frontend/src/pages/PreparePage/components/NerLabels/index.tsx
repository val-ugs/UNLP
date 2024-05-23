import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from 'hooks/redux';
import { skipToken } from '@reduxjs/toolkit/query';
import { NerLabelProps } from 'interfaces/nerLabel.interface';
import Button from 'components/common/Button';
import { nerLabelApi } from 'services/nerLabelService';
import NerLabelItem from './components/NerLabelItem';
import { nerLabelFormModalSlice } from 'store/reducers/nerLabelFormModalSlice';
import './styles.scss';

export interface NerLabelsProps {
  className: string;
  nlpDatasetId: number | undefined;
}

const NerLabels: FC<NerLabelsProps> = ({ className, nlpDatasetId }) => {
  const { t } = useTranslation();
  const [nerLabels, setNerLabels] = useState<NerLabelProps[]>([]);
  const { activate } = nerLabelFormModalSlice.actions;
  const dispatch = useAppDispatch();
  const {
    data: nerLabelsData,
    isLoading,
    isError,
  } = nerLabelApi.useGetNerLabelsByNlpDatasetIdQuery(
    nlpDatasetId ? Number(nlpDatasetId) : skipToken
  );

  useEffect(() => {
    if (nerLabelsData && !isError) setNerLabels(nerLabelsData);
    else setNerLabels([]);
  }, [nerLabelsData, nlpDatasetId]);

  const handleAddNerLabel = () => {
    if (nlpDatasetId) dispatch(activate({ nlpDatasetId, nerLabel: undefined }));
  };

  return (
    <div className={`ner-labels ${className}`}>
      <div className="ner-labels__title">
        {t('nerLabels.labels', 'Labels')}:
      </div>
      <div className="ner-labels__list">
        {nerLabels?.map((nerLabel: NerLabelProps) => (
          <NerLabelItem
            className="ner-labels__item"
            nerLabel={nerLabel}
            NlpDatasetId={nlpDatasetId}
            key={nerLabel.id}
          />
        ))}
        <div className="ner-labels__item">
          <Button
            className="ner-labels__add-button"
            onClick={handleAddNerLabel}
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NerLabels;

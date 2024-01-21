import React, { FC } from 'react';
import { useAppDispatch } from 'hooks/redux';
import { NerLabelProps } from 'interfaces/nerLabel.interface';
import Button from 'components/common/Button';
import { nerLabelApi } from 'services/nerLabelService';
import { nerLabelFormModalSlice } from 'store/reducers/nerLabelFormModalSlice';
import './styles.scss';

export interface NerLabelItemProps {
  className?: string;
  nerLabel: NerLabelProps;
  NlpDatasetId: number | undefined;
}

const NerLabelItem: FC<NerLabelItemProps> = ({
  className,
  nerLabel,
  NlpDatasetId,
}) => {
  const { activate } = nerLabelFormModalSlice.actions;
  const dispatch = useAppDispatch();
  const [deleteNerLabel, {}] = nerLabelApi.useDeleteNerLabelMutation();

  const handleEdit = () => {
    if (NlpDatasetId) dispatch(activate({ NlpDatasetId, nerLabel }));
  };

  const handleDelete = () => {
    deleteNerLabel(nerLabel.id);
  };

  return (
    <div className={`ner-label-item ${className}`} key={nerLabel.id}>
      <Button
        className="ner-label-item__button"
        style={{ backgroundColor: nerLabel.color }}
        onClick={handleEdit}
      >
        {nerLabel.name}
      </Button>
      <Button className="ner-label-item__delete" onClick={handleDelete}>
        -
      </Button>
    </div>
  );
};

export default NerLabelItem;

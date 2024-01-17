import React, { FC } from 'react';
import { NerLabelProps } from 'interfaces/nerLabel.interface';
import Button from 'components/common/Button';
import './styles.scss';

export interface NerLabelsProps {
  className: string;
}

const nerLabels: NerLabelProps[] = [
  {
    id: 1,
    name: 'Label 1',
    color: 'red',
  },
  {
    id: 2,
    name: 'Label 2',
    color: 'blue',
  },
];

const NerLabels: FC<NerLabelsProps> = ({ className }) => {
  return (
    <div className={`ner-labels ${className}`}>
      <div className="ner-labels__title">Labels:</div>
      <div className="ner-labels__list">
        {nerLabels?.map((nerLabel: NerLabelProps) => (
          <div className="ner-labels__item" key={nerLabel.id}>
            <Button
              className="ner-labels__item-button"
              style={{ backgroundColor: nerLabel.color }}
              onClick={() => {}}
            >
              {nerLabel.name}
            </Button>
            <Button className="ner-labels__item-delete" onClick={() => {}}>
              -
            </Button>
          </div>
        ))}
        <div className="ner-labels__item">
          <Button
            className="ner-labels__item-button nerlabels__item-add"
            onClick={() => {}}
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NerLabels;

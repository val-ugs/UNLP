import React, { FC } from 'react';
import { LabelProps } from 'interfaces/label.interface';
import Button from 'components/common/Button';
import './styles.scss';

export interface LabelsProps {
  className: string;
}

const labels: LabelProps[] = [
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

const Texts: FC<LabelsProps> = ({ className }) => {
  return (
    <div className={`labels ${className}`}>
      <div className="labels__title">Labels:</div>
      <div className="labels__list">
        {labels?.map((label: LabelProps) => (
          <Button
            className="labels__item"
            style={{ backgroundColor: label.color }}
            onClick={() => {}}
            key={label.id}
          >
            {label.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Texts;

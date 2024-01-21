import React, { FC } from 'react';
import './styles.scss';

export enum ArrowDirectionEnum {
  Left,
  Up,
  Right,
  Down,
}

export interface ArrowProps {
  className?: string;
  direction: ArrowDirectionEnum;
}

const Arrow: FC<ArrowProps> = ({ className, direction }) => {
  const getClassName = (direction: ArrowDirectionEnum) => {
    switch (direction) {
      case ArrowDirectionEnum.Left:
        return 'left';
      case ArrowDirectionEnum.Up:
        return 'up';
      case ArrowDirectionEnum.Right:
        return 'right';
      case ArrowDirectionEnum.Down:
        return 'down';
    }
  };

  return (
    <>
      <div className={`arrow ${className} ${getClassName(direction)}`}></div>
    </>
  );
};

export default Arrow;

import React, { FC } from 'react';
import './styles.scss';

export interface CounterProps {
  className?: string;
  value: number;
  maxValue: number;
}

const Counter: FC<CounterProps> = ({ className, value, maxValue }) => {
  return (
    <>
      <div className={`counter ${className}`}>
        {value}/{maxValue}
      </div>
    </>
  );
};

export default Counter;

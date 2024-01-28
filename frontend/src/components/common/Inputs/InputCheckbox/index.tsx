import React, { FC } from 'react';
import './styles.scss';

export interface InputCheckboxProps {
  className?: string;
  name: string;
  value?: number | string;
  defaultChecked: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const InputCheckbox: FC<InputCheckboxProps> = ({
  className,
  name,
  value,
  defaultChecked,
  onChange,
}) => {
  return (
    <>
      <input
        className={`input-checkbox ${className}`}
        type={'checkbox'}
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        onChange={onChange}
      />
    </>
  );
};

export default InputCheckbox;

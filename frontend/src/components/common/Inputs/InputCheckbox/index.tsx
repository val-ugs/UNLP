import React, { FC } from 'react';
import './styles.scss';

export interface InputCheckboxProps {
  className?: string;
  name: string;
  value?: number | string;
  checked: boolean;
  defaultChecked?: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const InputCheckbox: FC<InputCheckboxProps> = ({
  className,
  name,
  value,
  checked,
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
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={onChange}
      />
    </>
  );
};

export default InputCheckbox;

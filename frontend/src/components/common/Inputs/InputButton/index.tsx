import React, { FC, ReactNode } from 'react';
import './styles.scss';

export interface InputButtonProps {
  className?: string;
  name?: string;
  form?: string;
  formAction?: string;
  formEncType?:
    | 'application/x-www-form-urlencoded'
    | 'multipart/form-data'
    | 'text/plain';
  formMethod?: 'GET' | 'POST';
  formNoValidate?: boolean;
  formTarget?: '_blank' | '_self' | '_parent' | '_top';
  disabled?: boolean;
  children: ReactNode;
}

const InputButton: FC<InputButtonProps> = ({
  className,
  name,
  form,
  formAction,
  formEncType,
  formMethod,
  formNoValidate,
  formTarget,
  disabled,
  children,
}) => {
  return (
    <>
      <button
        className={`input-button ${className}`}
        type={'submit'}
        name={name}
        form={form}
        formAction={formAction}
        formEncType={formEncType}
        formMethod={formMethod}
        formNoValidate={formNoValidate}
        formTarget={formTarget ?? name}
        disabled={disabled}
      >
        {children}
      </button>
    </>
  );
};

export default InputButton;

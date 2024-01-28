import React, { FC, ReactNode } from 'react';
import { LabelElementProps } from 'interfaces/labelElement.interface';
import './styles.scss';

interface LabeledElementProps {
  className?: string;
  labelElement: LabelElementProps;
  required?: boolean;
  children: ReactNode;
}

const LabeledElement: FC<LabeledElementProps> = ({
  className,
  labelElement,
  required,
  children,
}) => {
  return (
    <div className={`labeled-element ${className}`}>
      <label
        className={`labeled-element__label ${labelElement.className}`}
        htmlFor={labelElement.htmlFor}
      >
        {required && <span className="labeled-element__label-star">*</span>}
        {labelElement.value}:
      </label>
      {children}
    </div>
  );
};

export default LabeledElement;

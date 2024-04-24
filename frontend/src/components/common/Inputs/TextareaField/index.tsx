import React, { ChangeEvent, FC } from 'react';
import Counter from '../../Counter';
import './styles.scss';

export interface TextareaFieldProps {
  className?: string;
  name: string;
  form?: string;
  value: string;
  setValue: (value: string) => void;
  rows?: number;
  maxLength?: number;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;

  autocomplete?: 'on' | 'off';
}

const TextareaField: FC<TextareaFieldProps> = ({
  className,
  name,
  form,
  value,
  setValue,
  rows,
  maxLength,
  placeholder,
  disabled,
  readonly,
}) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className={`textarea-field ${className}`}>
      <textarea
        className="textarea-field__textarea"
        name={name}
        value={value}
        form={form}
        onChange={handleChange}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readonly}
      />
      {maxLength && maxLength > 0 && (
        <div className="textarea-field__right">
          <Counter
            className="textarea-field__counter"
            value={value.length}
            maxValue={maxLength}
          />
        </div>
      )}
    </div>
  );
};

export default TextareaField;

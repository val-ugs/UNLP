import React, { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import InputCrossButton from '../InputCrossButton';
import './styles.scss';

export interface InputFieldProps {
  className?: string;
  type: 'email' | 'password' | 'search' | 'tel' | 'text' | 'url';
  name: string;
  value: string;
  setValue: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
  disabled?: boolean;
  autocomplete?: 'on' | 'off';
}

const InputField: FC<InputFieldProps> = ({
  className,
  type,
  name,
  value,
  setValue,
  maxLength,
  placeholder,
  disabled,
  autocomplete = 'off',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isFilled, setIsFilled] = useState<boolean>(false);

  useEffect(() => {
    if (isFocused) setIsFilled(value.length > 0 ? true : false);
  }, [isFocused, value]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleClearValue = () => {
    setValue('');
    if (inputRef.current) inputRef.current.blur();
  };

  return (
    <div className={`input-field ${className}`}>
      <input
        className="input-field__input"
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        maxLength={maxLength}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autocomplete}
        onFocus={handleFocus}
        onBlur={handleBlur}
        ref={inputRef}
      />
      {isFocused && isFilled && (
        <div className="input-field__clear">
          <InputCrossButton
            className="input-field__clear-button"
            onMouseDown={handleClearValue}
          />
        </div>
      )}
    </div>
  );
};

export default InputField;

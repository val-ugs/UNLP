import React, { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import InputCrossButton from '../InputCrossButton';
import './styles.scss';

export interface InputNumberProps {
  className?: string;
  name: string;
  value: number;
  setValue: (value: number) => void;
  step?: number;
  placeholder?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
}

const InputNumber: FC<InputNumberProps> = ({
  className,
  name,
  value,
  setValue,
  step,
  placeholder,
  disabled,
  min,
  max,
}) => {
  const inputRef = useRef<HTMLInputElement>();
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isFilled, setIsFilled] = useState<boolean>(false);

  useEffect(() => {
    if (isFocused) setIsFilled(value.toString().length > 0 ? true : false);
  }, [isFocused, value]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.valueAsNumber);
  };

  const handleClearValue = () => {
    setValue({} as number);
    if (inputRef.current) inputRef.current.blur();
  };

  return (
    <div className={`input-number ${className}`}>
      <input
        className="input-number__input"
        type={'number'}
        name={name}
        value={value}
        onChange={handleChange}
        step={step}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        max={max}
        onFocus={handleFocus}
        onBlur={handleBlur}
        ref={inputRef}
      />
      {isFocused && isFilled && (
        <div className="input-number__clear">
          <InputCrossButton
            className="input-number__clear-button"
            onMouseDown={handleClearValue}
          />
        </div>
      )}
    </div>
  );
};

export default InputNumber;

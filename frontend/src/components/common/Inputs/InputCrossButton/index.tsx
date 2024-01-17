import React, { FC, MouseEvent } from 'react';
import './styles.scss';

interface InputCrossButtonProps {
  className?: string;
  onMouseDown?: (e: MouseEvent<HTMLButtonElement>) => void;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

const InputCrossButton: FC<InputCrossButtonProps> = ({
  className,
  onMouseDown,
  onClick,
}) => {
  return (
    <>
      <button
        className={`input-cross-button ${className}`}
        onMouseDown={onMouseDown}
        onClick={onClick}
      >
        &#215;
      </button>
    </>
  );
};

export default InputCrossButton;

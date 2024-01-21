import React, { FC, ReactNode } from 'react';
import './styles.scss';

export interface ButtonProps {
  className?: string;
  style?: React.CSSProperties;
  onClick: () => void;
  children: ReactNode;
}

const Button: FC<ButtonProps> = ({ className, style, onClick, children }) => {
  return (
    <>
      <button className={`button ${className}`} style={style} onClick={onClick}>
        {children}
      </button>
    </>
  );
};

export default Button;

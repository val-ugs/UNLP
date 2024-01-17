import React, { FC, ReactNode } from 'react';
import './styles.scss';

interface ModalProps {
  className?: string;
  isActive: boolean;
  children: ReactNode;
}

const Modal: FC<ModalProps> = ({ className, isActive, children }) => {
  return (
    <div className="modal">
      {isActive && children && (
        <div className="modal__main">
          <div className="modal__block"></div>
          <div className="modal__window-wrapper">
            <div className={`modal__window ${className}`}>{children}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;

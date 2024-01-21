import React, { FC, ReactNode } from 'react';
import Button from 'components/common/Button';
import Modal from 'components/common/Modal';
import './styles.scss';

export interface ContentModalProps {
  className: string;
  title: string;
  isActive: boolean;
  handleClose: () => void;
  children: ReactNode;
}

const ContentModal: FC<ContentModalProps> = ({
  className,
  title,
  isActive,
  handleClose,
  children,
}) => {
  return (
    <Modal className={`content-modal ${className}`} isActive={isActive}>
      <Button className="content-modal__close-button" onClick={handleClose}>
        x
      </Button>
      <div className="content-modal__body">
        <div className="content-modal__title">{title}</div>
        <div className="content-modal__content">{children}</div>
      </div>
    </Modal>
  );
};

export default ContentModal;

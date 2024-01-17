import React, { FC, ReactNode } from 'react';
import Button from 'components/common/Button';
import Modal from 'components/common/Modal';
import './styles.scss';

export interface ContentModalProps {
  className: string;
  isActive: boolean;
  handleClose: () => void;
  children: ReactNode;
}

const ContentModal: FC<ContentModalProps> = ({
  className,
  handleClose,
  isActive,
  children,
}) => {
  return (
    <Modal className={`content-modal ${className}`} isActive={isActive}>
      <Button className="content-modal__close-button" onClick={handleClose}>
        x
      </Button>
      {children}
    </Modal>
  );
};

export default ContentModal;

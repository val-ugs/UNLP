import React, { FC } from 'react';
import Modal from 'components/common/Modal';
import { useAppSelector } from 'hooks/redux';
import './styles.scss';

const LoadingModal: FC = () => {
  const { isActive } = useAppSelector((state) => state.loadingModalReducer);

  return (
    <Modal className="loading-modal" isActive={isActive}>
      <div className="loading-modal__loader"></div>
      <div className="loading-modal__title">Loading...</div>
    </Modal>
  );
};

export default LoadingModal;

import { FC } from 'react';
import NerLabelFormModal from 'components/modals/NerLabelFormModal';
import LoadDataModal from 'components/modals/LoadDataModal';
import './styles.scss';

const AppModals: FC = () => {
  return (
    <>
      <NerLabelFormModal />
      <LoadDataModal />
    </>
  );
};

export default AppModals;

import { FC } from 'react';
import NerLabelFormModal from 'components/modals/NerLabelFormModal';
import LoadDataModal from 'components/modals/LoadDataModal';
import NlpTokenSettingsModal from 'components/modals/NlpTokenSettingsModal';
import './styles.scss';

const AppModals: FC = () => {
  return (
    <>
      <NerLabelFormModal />
      <LoadDataModal />
      <NlpTokenSettingsModal />
    </>
  );
};

export default AppModals;

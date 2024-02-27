import { FC } from 'react';
import NerLabelFormModal from 'components/modals/NerLabelFormModal';
import LoadDataModal from 'components/modals/LoadDataModal';
import NlpTokenSettingsModal from 'components/modals/NlpTokenSettingsModal';
import './styles.scss';
import HuggingFaceModelFormModal from 'components/modals/HuggingFaceModelFormModal';

const AppModals: FC = () => {
  return (
    <>
      <HuggingFaceModelFormModal />
      <LoadDataModal />
      <NerLabelFormModal />
      <NlpTokenSettingsModal />
    </>
  );
};

export default AppModals;

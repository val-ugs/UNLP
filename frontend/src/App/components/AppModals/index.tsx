import { FC } from 'react';
import ActionModal from 'components/modals/ActionModal';
import HuggingFaceModelFormModal from 'components/modals/HuggingFaceModelFormModal';
import LoadDataModal from 'components/modals/LoadDataModal';
import NerLabelFormModal from 'components/modals/NerLabelFormModal';
import NlpTokenSettingsModal from 'components/modals/NlpTokenSettingsModal';
import './styles.scss';

const AppModals: FC = () => {
  return (
    <>
      <ActionModal />
      <HuggingFaceModelFormModal />
      <LoadDataModal />
      <NerLabelFormModal />
      <NlpTokenSettingsModal />
    </>
  );
};

export default AppModals;

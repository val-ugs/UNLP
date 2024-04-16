import React, { FC, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import ContentModal from 'components/interstitial/ContentModal';
import { ActionProps } from 'interfaces/action.interface';
import { actionModalSlice } from 'store/reducers/actionModalSlice';
import './styles.scss';
import { listOfActions } from 'data/listOfActions';

const ActionModal: FC = () => {
  const [action, setAction] = useState<ActionProps>();
  const { isActive, actionName } = useAppSelector(
    (state) => state.actionModalReducer
  );
  const { deactivate } = actionModalSlice.actions;
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(deactivate());
  };

  useEffect(() => {
    setAction(listOfActions.find((a) => a.name == actionName));
  }, [actionName]);

  return (
    <>
      {action && (
        <ContentModal
          className="action-modal"
          title={action.name}
          isActive={isActive}
          handleClose={handleClose}
        >
          {action.component}
        </ContentModal>
      )}
    </>
  );
};

export default ActionModal;

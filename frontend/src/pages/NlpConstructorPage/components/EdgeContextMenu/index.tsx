import React, { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from 'hooks/redux';
import Button from 'components/common/Button';
import { reactFlowSlice } from 'store/reducers/reactFlowSlice';
import './styles.scss';

interface EdgeContextMenuProps {
  edgeId: string;
  coords: { x: number; y: number };
}

const EdgeContextMenu: FC<EdgeContextMenuProps> = ({ edgeId, coords }) => {
  const { t } = useTranslation();
  const { deleteEdge } = reactFlowSlice.actions;
  const dispatch = useAppDispatch();

  const handleDeleteEdge = useCallback(() => {
    dispatch(deleteEdge(edgeId));
  }, [dispatch, deleteEdge, edgeId]);

  return (
    <div
      className="edge-context-menu"
      style={{ top: coords.y, left: coords.x }}
    >
      <div className="edge-context-menu__title">
        {t('edgeContextMenu.edgeMenu', 'Edge menu:')}
      </div>
      <Button className="edge-context-menu__button" onClick={handleDeleteEdge}>
        {t('edgeContextMenu.delete', 'Delete')}
      </Button>
    </div>
  );
};

export default EdgeContextMenu;

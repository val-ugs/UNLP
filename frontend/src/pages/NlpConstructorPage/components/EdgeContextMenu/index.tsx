import React, { FC, useCallback } from 'react';
import { useAppDispatch } from 'hooks/redux';
import Button from 'components/common/Button';
import { reactFlowSlice } from 'store/reducers/reactFlowSlice';
import './styles.scss';

interface EdgeContextMenuProps {
  edgeId: string;
  coords: { x: number; y: number };
}

const EdgeContextMenu: FC<EdgeContextMenuProps> = ({ edgeId, coords }) => {
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
      <div className="edge-context-menu__title">Edge menu</div>
      <Button className="edge-context-menu__button" onClick={handleDeleteEdge}>
        Delete
      </Button>
    </div>
  );
};

export default EdgeContextMenu;

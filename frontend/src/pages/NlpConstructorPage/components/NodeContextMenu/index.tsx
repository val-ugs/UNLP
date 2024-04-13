import React, { FC, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { v4 as uuidv4 } from 'uuid';
import Button from 'components/common/Button';
import { Node } from 'reactflow';
import { reactFlowSlice } from 'store/reducers/reactFlowSlice';
import './styles.scss';

interface NodeContextMenuProps {
  nodeId: string;
  coords: { x: number; y: number };
}

const NodeContextMenu: FC<NodeContextMenuProps> = ({ nodeId, coords }) => {
  const { nodes } = useAppSelector((state) => state.reactFlowReducer);
  const { addNode, deleteNode } = reactFlowSlice.actions;
  const dispatch = useAppDispatch();

  const handleDuplicateNode = useCallback(() => {
    const node: Node = nodes.find((node) => node.id == nodeId)!;
    const position = {
      x: node.position.x + 50,
      y: node.position.y + 50,
    };

    dispatch(addNode({ ...node, id: uuidv4(), position }));
  }, [nodes, dispatch, addNode, nodeId]);

  const handleDeleteNode = useCallback(() => {
    dispatch(deleteNode(nodeId));
  }, [dispatch, deleteNode, nodeId]);

  return (
    <div
      className="node-context-menu"
      style={{ top: coords.y, left: coords.x }}
    >
      <div className="node-context-menu__title">Node menu</div>
      <Button
        className="node-context-menu__button"
        onClick={handleDuplicateNode}
      >
        Duplicate
      </Button>
      <Button className="node-context-menu__button" onClick={handleDeleteNode}>
        Delete
      </Button>
    </div>
  );
};

export default NodeContextMenu;

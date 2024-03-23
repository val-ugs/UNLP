import React, { FC, useCallback } from 'react';
import Button from 'components/common/Button';
import { Node, useReactFlow } from 'reactflow';
import './styles.scss';

interface NodeContextMenuProps {
  nodeId: string;
  coords: { x: number; y: number };
}

const NodeContextMenu: FC<NodeContextMenuProps> = ({ nodeId, coords }) => {
  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();

  const handleDuplicateNode = useCallback(() => {
    const node: Node = getNode(nodeId)!;
    const position = {
      x: node.position.x + 50,
      y: node.position.y + 50,
    };

    addNodes({ ...node, id: `${node.id}-copy`, position });
  }, [nodeId, getNode, addNodes]);

  const handleDeleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
    setEdges((edges) => edges.filter((edge) => edge.source !== nodeId));
  }, [nodeId, setNodes, setEdges]);

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

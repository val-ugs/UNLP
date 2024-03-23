import React, { FC, useCallback } from 'react';
import OrderedList from 'components/common/OrderedList';
import Button from 'components/common/Button';
import { Node, useReactFlow } from 'reactflow';
import {
  NlpConstructorNode,
  listOfNlpConstructorNodes,
} from 'pages/NlpConstructorPage/nodes/nlpConstructorNodeTypes';
import './styles.scss';

interface PaneContextMenuProps {
  setNodes: React.Dispatch<
    React.SetStateAction<
      Node<
        {
          label: string;
          value?: undefined;
        },
        string | undefined
      >[]
    >
  >;
  coords: { x: number; y: number };
}

let id = 1;
const getId = () => `node-${id++}`;

const PaneContextMenu: FC<PaneContextMenuProps> = ({ setNodes, coords }) => {
  const { screenToFlowPosition } = useReactFlow();
  const flowCoords = screenToFlowPosition({
    x: coords.x,
    y: coords.y,
  });

  const addNode = useCallback(
    (nodeType: string) => {
      const id = getId();
      const newNode: Node = {
        id,
        position: {
          x: flowCoords.x,
          y: flowCoords.y,
        },
        data: { label: `Node ${id}` },
        type: nodeType,
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [flowCoords.x, flowCoords.y, setNodes]
  );

  return (
    <div
      className="pane-context-menu"
      style={{ top: coords.y, left: coords.x }}
    >
      <div className="pane-context-menu__title">Add node</div>
      <OrderedList className="pane-context-menu__nodes" type="none">
        {listOfNlpConstructorNodes.map((node: NlpConstructorNode) => (
          <OrderedList.Item className="pane-context-menu__node" key={node.name}>
            <Button
              className="pane-context-menu__button"
              onClick={() => {
                addNode(node.type);
              }}
            >
              {node.name}
            </Button>
          </OrderedList.Item>
        ))}
      </OrderedList>
    </div>
  );
};

export default PaneContextMenu;

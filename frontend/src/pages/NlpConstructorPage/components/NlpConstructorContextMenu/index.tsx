import React, { FC } from 'react';
import OrderedList from 'components/common/OrderedList';
import Button from 'components/common/Button';
import { Node, useReactFlow } from 'reactflow';
import {
  NlpConstructorNode,
  listOfNlpConstructorNodes,
} from 'pages/NlpConstructorPage/nodes/nlpConstructorNodeTypes';
import './styles.scss';

interface NlpConstructorContextMenuProps {
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

const NlpConstructorContextMenu: FC<NlpConstructorContextMenuProps> = ({
  setNodes,
  coords,
}) => {
  const { screenToFlowPosition } = useReactFlow();
  const flowCoords = screenToFlowPosition({
    x: coords.x,
    y: coords.y,
  });

  const addNode = (nodeType: string) => {
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
  };

  return (
    <div
      className="nlp-constructor-context-menu"
      style={{ top: flowCoords.y, left: flowCoords.x }}
    >
      <div className="nlp-constructor-context-menu__title">Add node</div>
      <OrderedList className="nlp-constructor-context-menu__nodes" type="none">
        {listOfNlpConstructorNodes.map((node: NlpConstructorNode) => (
          <OrderedList.Item
            className="nlp-constructor-context-menu__node"
            key={node.name}
          >
            <Button
              className="nlp-constructor-context-menu__button"
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

export default NlpConstructorContextMenu;

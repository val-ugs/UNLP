import React, { FC, useCallback } from 'react';
import { useAppDispatch } from 'hooks/redux';
import { v4 as uuidv4 } from 'uuid';
import OrderedList from 'components/common/OrderedList';
import Button from 'components/common/Button';
import { Node, useReactFlow } from 'reactflow';
import {
  NlpConstructorNode,
  listOfNlpConstructorNodes,
} from 'pages/NlpConstructorPage/reactFlowNodes/nodes/nlpConstructorNodeTypes';
import { reactFlowSlice } from 'store/reducers/reactFlowSlice';
import './styles.scss';

interface PaneContextMenuProps {
  coords: { x: number; y: number };
}

const PaneContextMenu: FC<PaneContextMenuProps> = ({ coords }) => {
  const { addNode } = reactFlowSlice.actions;
  const dispatch = useAppDispatch();
  const { screenToFlowPosition } = useReactFlow();
  const flowCoords = screenToFlowPosition({
    x: coords.x,
    y: coords.y,
  });

  const addNodeByType = useCallback(
    (nodeType: string) => {
      const id = uuidv4();
      const newNode: Node = {
        id,
        position: {
          x: flowCoords.x,
          y: flowCoords.y,
        },
        data: null,
        type: nodeType,
      };
      dispatch(addNode(newNode));
    },
    [flowCoords.x, flowCoords.y, dispatch, addNode]
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
                addNodeByType(node.type);
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

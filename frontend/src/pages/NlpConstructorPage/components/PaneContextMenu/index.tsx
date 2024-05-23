import React, { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from 'hooks/redux';
import { v4 as uuidv4 } from 'uuid';
import { Node, useReactFlow } from 'reactflow';
import { reactFlowSlice } from 'store/reducers/reactFlowSlice';
import {
  listOfNlpConstructorActionNodes,
  listOfNlpConstructorMetricNodes,
  listOfNlpConstructorNodes,
} from 'pages/NlpConstructorPage/reactFlowNodes/nlpConstructorNodeTypes';
import NodeGroupMenu from './components/NodeGroupMenu';
import './styles.scss';

interface PaneContextMenuProps {
  coords: { x: number; y: number };
}

const PaneContextMenu: FC<PaneContextMenuProps> = ({ coords }) => {
  const { t } = useTranslation();
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
      <div className="pane-context-menu__title">
        {t('paneContextMenu.add', 'Add')}
      </div>
      <NodeGroupMenu
        groupTitle={'nodes'}
        listOfNodes={listOfNlpConstructorNodes}
        addNodeByType={addNodeByType}
      />
      <NodeGroupMenu
        groupTitle={'actions'}
        listOfNodes={listOfNlpConstructorActionNodes}
        addNodeByType={addNodeByType}
      />
      <NodeGroupMenu
        groupTitle={'metrics'}
        listOfNodes={listOfNlpConstructorMetricNodes}
        addNodeByType={addNodeByType}
      />
    </div>
  );
};

export default PaneContextMenu;

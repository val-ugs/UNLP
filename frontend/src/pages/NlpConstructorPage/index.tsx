import React, { FC, useCallback, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import Layout from 'pages/_layouts/Layout';
import ReactFlow, {
  Background,
  BackgroundVariant,
  ControlButton,
  Controls,
  MiniMap,
  Node,
} from 'reactflow';
import useContextMenu from 'hooks/useContextMenu';
import { nlpConstructorNodeTypes } from './reactFlowNodes/nodes/nlpConstructorNodeTypes';
import PaneContextMenu from './components/PaneContextMenu';
import NodeContextMenu from './components/NodeContextMenu';
import { reactFlowSlice, runNodeAsync } from 'store/reducers/reactFlowSlice';
import 'reactflow/dist/style.css';
import './styles.scss';

const NlpConstructorPage: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const {
    clicked: paneClicked,
    setClicked: setPaneClicked,
    coords: paneCoords,
    setCoords: setPaneCoords,
  } = useContextMenu();
  const {
    clicked: nodeClicked,
    setClicked: setNodeClicked,
    coords: nodeCoords,
    setCoords: setNodeCoords,
  } = useContextMenu();
  const [nodeId, setNodeId] = useState<string>('');
  const { nodes, edges } = useAppSelector((state) => state.reactFlowReducer);
  const { onNodesChange, onEdgesChange, onConnect } = reactFlowSlice.actions;
  const dispatch = useAppDispatch();

  const handlePaneContextMenu = useCallback(
    (e: React.MouseEvent<Element, MouseEvent>) => {
      e.preventDefault();
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setPaneClicked(true);
        setPaneCoords({ x: e.pageX - rect.x, y: e.pageY - rect.y });
      }
    },
    [setPaneClicked, setPaneCoords]
  );

  const handleNodeContextMenu = useCallback(
    (e: React.MouseEvent<Element, MouseEvent>, n: Node) => {
      e.preventDefault();
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setNodeId(n.id);
        setNodeClicked(true);
        setNodeCoords({ x: e.pageX - rect.x, y: e.pageY - rect.y });
      }
    },
    [setNodeClicked, setNodeCoords]
  );

  const handleRun = async () => {
    try {
      dispatch(runNodeAsync());
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Layout>
      <div className="nlp-constructor-page">
        <ReactFlow
          ref={ref}
          nodes={nodes}
          edges={edges}
          onNodesChange={(e) => dispatch(onNodesChange(e))}
          onEdgesChange={(e) => dispatch(onEdgesChange(e))}
          onConnect={(e) => dispatch(onConnect(e))}
          nodeTypes={nlpConstructorNodeTypes}
          onPaneContextMenu={handlePaneContextMenu}
          onNodeContextMenu={handleNodeContextMenu}
        >
          {paneClicked && <PaneContextMenu coords={paneCoords} />}
          {nodeClicked && (
            <NodeContextMenu nodeId={nodeId} coords={nodeCoords} />
          )}
          <Controls>
            <ControlButton onClick={handleRun}>Run</ControlButton>
          </Controls>
          <MiniMap />
          <Background variant={BackgroundVariant.Cross} gap={12} size={1} />
        </ReactFlow>
      </div>
    </Layout>
  );
};

export default NlpConstructorPage;

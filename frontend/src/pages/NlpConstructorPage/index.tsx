import React, { FC, useCallback, useRef, useState } from 'react';
import Layout from 'pages/_layouts/Layout';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  ControlButton,
  Controls,
  Edge,
  MarkerType,
  MiniMap,
  Node,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import useContextMenu from 'hooks/useContextMenu';
import { nlpConstructorNodeTypes } from './nodes/nlpConstructorNodeTypes';
import PaneContextMenu from './components/PaneContextMenu';
import NodeContextMenu from './components/NodeContextMenu';
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
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params: Edge | Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: '#787878',
            },
          },
          eds
        )
      ),
    [setEdges]
  );

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

  const handleRun = () => {
    console.log('run');
  };

  return (
    <Layout>
      <div className="nlp-constructor-page">
        <ReactFlow
          ref={ref}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nlpConstructorNodeTypes}
          onPaneContextMenu={handlePaneContextMenu}
          onNodeContextMenu={handleNodeContextMenu}
        >
          {paneClicked && (
            <PaneContextMenu setNodes={setNodes} coords={paneCoords} />
          )}
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

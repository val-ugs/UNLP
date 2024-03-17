import React, { FC, useCallback, useRef } from 'react';
import Layout from 'pages/_layouts/Layout';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  MarkerType,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import useContextMenu from 'hooks/useContextMenu';
import NlpConstructorContextMenu from './components/NlpConstructorContextMenu';
import { nlpConstructorNodeTypes } from './nodes/nlpConstructorNodeTypes';
import 'reactflow/dist/style.css';
import './styles.scss';

const NlpConstructorPage: FC = () => {
  const ref = useRef(null);
  const { clicked, setClicked, coords, setCoords } = useContextMenu();
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

  const handleContextMenu = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setClicked(true);
      setCoords({ x: e.pageX - rect.x, y: e.pageY - rect.y });
    }
  };

  return (
    <Layout>
      <div className="nlp-constructor-page" ref={ref}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nlpConstructorNodeTypes}
          onContextMenu={handleContextMenu}
        >
          {clicked && (
            <NlpConstructorContextMenu setNodes={setNodes} coords={coords} />
          )}
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Cross} gap={12} size={1} />
        </ReactFlow>
      </div>
    </Layout>
  );
};

export default NlpConstructorPage;

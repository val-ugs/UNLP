import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import Layout from 'pages/_layouts/Layout';
import ReactFlow, {
  Background,
  BackgroundVariant,
  ControlButton,
  Controls,
  MiniMap,
  Node,
  getConnectedEdges,
  getIncomers,
  getOutgoers,
} from 'reactflow';
import useContextMenu from 'hooks/useContextMenu';
import { nlpConstructorNodeTypes } from './nodes/nlpConstructorNodeTypes';
import PaneContextMenu from './components/PaneContextMenu';
import NodeContextMenu from './components/NodeContextMenu';
import { reactFlowSlice, runNodeAsync } from 'store/reducers/reactFlowSlice';
import { runNode } from './nodes/nodeRunners';
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
  const { onNodesChange, onEdgesChange, onConnect, editNode } =
    reactFlowSlice.actions;
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

  // // const handleRun = async () => {
  // //   const processNode = async (node: Node) => {
  // //     const sourceNodes = getIncomers(node, nodes, edges);

  // //     const sourcePromises = sourceNodes.map((n) => {
  // //       console.log(`Resolving source node ${n.id}`);
  // //       return processNode(n);
  // //     });
  // //     if (sourcePromises.length) {
  // //       console.log(`Waiting for ${sourcePromises} sources to resolve`);
  // //       await Promise.all(sourcePromises);
  // //       console.log(`Sources resolved`);
  // //     }

  // //     const sourceEdges = getConnectedEdges([node], edges);
  // //     // populate the node's input with the output of the sources
  // //     const input = sourceEdges.reduce((acc, edge) => {
  // //       const sourceNode = sourceNodes.find((node) => node.id === edge.source);
  // //       if (sourceNode) {
  // //         // @ts-ignore
  // //         acc[edge.targetHandle.split('-').pop()] =
  // //           // @ts-ignore
  // //           sourceNode.data.output[edge.sourceHandle.split('-').pop()];
  // //       }
  // //       return acc;
  // //     }, {});
  // //     // set the node's input

  // //     dispatch(
  // //       editNode({
  // //         id: node.id,
  // //         newData: {
  // //           input: {
  // //             ...node.data?.input,
  // //             ...input,
  // //           },
  // //         },
  // //       })
  // //     ); // locally

  // //     // run the node
  // //     const output = await runNode(node);
  // //     console.log('output:');
  // //     console.log(output);
  // //     // update the node's output
  // //     dispatch(
  // //       editNode({
  // //         id: node.id,
  // //         newData: {
  // //           input: {
  // //             ...node.data?.input,
  // //             ...input,
  // //           },
  // //           output: output,
  // //         },
  // //       })
  // //     );

  // //     console.log(
  // //       'returning output for node',
  // //       node.id,
  // //       output,
  // //       'had input',
  // //       input
  // //     );
  // //   };

  // //   const endNodes: Node[] = nodes.filter(
  // //     (node: Node) =>
  // //       getIncomers(node, nodes, edges).length > 0 &&
  // //       getOutgoers(node, nodes, edges).length == 0
  // //   );
  // //   for (const node of endNodes) {
  // //     processNode(node);
  // //   }
  // // };

  // // const handleRun1 = async () => {
  // //   const CreatePipeline = (endNodes: Node[], nodePipeline: Node[]) => {
  // //     endNodes.map((node: Node) => {
  // //       CreatePipeline(getIncomers(node, nodes, edges), nodePipeline);
  // //       if (nodePipeline.indexOf(node) === -1) nodePipeline.push(node); // if not found add node
  // //     });
  // //   };

  // //   // find all start nodes
  // //   const endNodes: Node[] = nodes.filter(
  // //     (node: Node) =>
  // //       getIncomers(node, nodes, edges).length > 0 &&
  // //       getOutgoers(node, nodes, edges).length == 0
  // //   );

  // //   const nodePipeline: Node[] = []; // array of nodes from start to finish

  // //   CreatePipeline(endNodes, nodePipeline);

  // //   for (const node of nodePipeline) {
  // //     console.log(node);
  // //     await runNode(node);
  // //     const output = node.data?.output;
  // //     getOutgoers(node, nodes, edges).map((outgoer: Node) => {
  // //       editNode(setNodes, outgoer.id, {
  // //         input: {
  // //           ...outgoer.data?.input,
  // //           ...output,
  // //         },
  // //       });
  // //     });
  // //   }

  // //   console.log(nodePipeline);
  // // };

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

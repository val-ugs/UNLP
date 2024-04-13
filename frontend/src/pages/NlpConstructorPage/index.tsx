import React, {
  ChangeEvent,
  FC,
  useCallback,
  useId,
  useRef,
  useState,
} from 'react';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  MiniMap,
  Node,
  Panel,
  ReactFlowInstance,
} from 'reactflow';
import { nlpConstructorNodeTypes } from './reactFlowNodes/nlpConstructorNodeTypes';
import Layout from 'pages/_layouts/Layout';
import useContextMenu from 'hooks/useContextMenu';
import PaneContextMenu from './components/PaneContextMenu';
import NodeContextMenu from './components/NodeContextMenu';
import EdgeContextMenu from './components/EdgeContextMenu';
import { reactFlowSlice, runNodeAsync } from 'store/reducers/reactFlowSlice';
import Button from 'components/common/Button';
import 'reactflow/dist/style.css';
import './styles.scss';

const flowKey = 'react-flow-key';

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
  const {
    clicked: edgeClicked,
    setClicked: setEdgeClicked,
    coords: edgeCoords,
    setCoords: setEdgeCoords,
  } = useContextMenu();
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance>();
  const [nodeId, setNodeId] = useState<string>('');
  const [edgeId, setEdgeId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [animationErrorActive, setAnimationErrorActive] =
    useState<boolean>(false);
  const { nodes, edges } = useAppSelector((state) => state.reactFlowReducer);
  const { onNodesChange, onEdgesChange, onConnect, setNodes, setEdges } =
    reactFlowSlice.actions;
  const dispatch = useAppDispatch();
  const nlpConstructorId = useId();

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
    (e: React.MouseEvent<Element, MouseEvent>, currentNode: Node) => {
      e.preventDefault();
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setNodeId(currentNode.id);
        setNodeClicked(true);
        setNodeCoords({ x: e.pageX - rect.x, y: e.pageY - rect.y });
      }
    },
    [setNodeClicked, setNodeCoords]
  );

  const handleEdgeContextMenu = useCallback(
    (e: React.MouseEvent<Element, MouseEvent>, currentEdge: Edge) => {
      e.preventDefault();
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setEdgeId(currentEdge.id);
        setEdgeClicked(true);
        setEdgeCoords({ x: e.pageX - rect.x, y: e.pageY - rect.y });
      }
    },
    [setEdgeClicked, setEdgeCoords]
  );

  const handleSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [rfInstance]);

  const handleRestore = useCallback(() => {
    const restoreFlow = async () => {
      const item = localStorage.getItem(flowKey);
      if (!item) return;

      const flow = JSON.parse(item);
      if (!flow) return;

      const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      dispatch(setNodes(flow.nodes || []));
      dispatch(setEdges(flow.edges || []));
      rfInstance?.setViewport({ x, y, zoom });
    };

    restoreFlow();
  }, [dispatch, rfInstance, setEdges, setNodes]);

  const handleSaveToFile = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      const href = URL.createObjectURL(
        new Blob([JSON.stringify(flow)], { type: 'application/json' })
      );
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', 'scheme.json');
      document.body.appendChild(link);
      link.click();

      // clean up and remove ObjectURL
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    }
  }, [rfInstance]);

  const handleLoadFromFile = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = async () => {
          const json = reader.result;

          const flow = JSON.parse(json as string);
          if (!flow) return;

          const { x = 0, y = 0, zoom = 1 } = flow.viewport;
          dispatch(setNodes(flow.nodes || []));
          dispatch(setEdges(flow.edges || []));
          rfInstance?.setViewport({ x, y, zoom });
        };
      }
    },
    [rfInstance]
  );

  const handleRun = async () => {
    dispatch(runNodeAsync())
      .unwrap()
      .catch((e) => {
        console.log(e);
        setError(e.message);
        // restart animation
        setAnimationErrorActive(false);
        setTimeout(() => setAnimationErrorActive(true), 0.1);
      });
  };

  const handleAnimationErrorEnd = () => {
    setAnimationErrorActive(false);
  };

  return (
    <Layout>
      <div className="nlp-constructor-page">
        <ReactFlow
          className="nlp-constructor-page__react-flow"
          ref={ref}
          nodes={nodes}
          edges={edges}
          onNodesChange={(e) => dispatch(onNodesChange(e))}
          onEdgesChange={(e) => dispatch(onEdgesChange(e))}
          onConnect={(e) => dispatch(onConnect(e))}
          isValidConnection={(connection) =>
            connection.targetHandle === connection.sourceHandle
          }
          nodeTypes={nlpConstructorNodeTypes}
          onPaneContextMenu={handlePaneContextMenu}
          onNodeContextMenu={handleNodeContextMenu}
          onEdgeContextMenu={handleEdgeContextMenu}
          onInit={setRfInstance}
        >
          {paneClicked && <PaneContextMenu coords={paneCoords} />}
          {nodeClicked && (
            <NodeContextMenu nodeId={nodeId} coords={nodeCoords} />
          )}
          {edgeClicked && (
            <EdgeContextMenu edgeId={edgeId} coords={edgeCoords} />
          )}
          <Panel className="nlp-constructor-page__panel" position={'top-left'}>
            <div className="nlp-constructor-page__panel-item">
              <Button
                className="nlp-constructor-page__panel-button"
                onClick={handleSave}
              >
                Save
              </Button>
            </div>
            <div className="nlp-constructor-page__panel-item">
              <Button
                className="nlp-constructor-page__panel-button"
                onClick={handleRestore}
              >
                Restore
              </Button>
            </div>
            <div className="nlp-constructor-page__panel-item">
              <Button
                className="nlp-constructor-page__panel-button"
                onClick={handleSaveToFile}
              >
                Save to file
              </Button>
            </div>
            <div className="nlp-constructor-page__panel-item">
              <label
                className="nlp-constructor-page__panel-button"
                htmlFor={nlpConstructorId}
              >
                <input
                  type="file"
                  accept=".txt, .json"
                  id={nlpConstructorId}
                  onChange={handleLoadFromFile}
                  hidden
                />
                Load from file
              </label>
            </div>
            <div className="nlp-constructor-page__panel-item">
              <Button
                className="nlp-constructor-page__panel-button"
                onClick={handleRun}
              >
                Run
              </Button>
            </div>
          </Panel>
          <Controls position={'bottom-left'} />
          <MiniMap />
          <Background variant={BackgroundVariant.Cross} gap={12} size={1} />
          {error && (
            <div
              className={`nlp-constructor-page__error ${
                animationErrorActive ? 'animate' : ''
              }`}
              onAnimationEnd={handleAnimationErrorEnd}
            >
              Error: {error}
            </div>
          )}
        </ReactFlow>
      </div>
    </Layout>
  );
};

export default NlpConstructorPage;

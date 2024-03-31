import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  Connection,
  Edge,
  EdgeChange,
  MarkerType,
  Node,
  NodeChange,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  getConnectedEdges,
  getIncomers,
  getOutgoers,
} from 'reactflow';
import { runNode } from './reactflowRunners/runNode';
import { createAppAsyncThunk } from 'store/createAppAsyncThunk';

interface EditNodeProps {
  id: string;
  newData: any;
}

const editNodeAsync = createAppAsyncThunk(
  'reactflow/editNode',
  async ({ id, newData }: EditNodeProps, thunkApi) => {
    const { nodes } = thunkApi.getState().reactFlowReducer;
    console.log('edit node......');

    return nodes.map((node: Node) => {
      if (node.id === id) {
        return {
          ...node,
          data: {
            ...node.data,
            ...newData,
          },
        };
      }
      return node;
    });
  }
);

export const runNodeAsync = createAppAsyncThunk(
  'reactflow/run',
  async (_, thunkApi) => {
    const processNode = async (node: Node, thunkApi: any) => {
      const { nodes, edges } = thunkApi.getState().reactFlowReducer;

      const sourceNodes = getIncomers(node, nodes, edges);
      const sourcePromises = sourceNodes.map((n) => {
        console.log(`Resolving source node ${node.id}`);
        return processNode(n, thunkApi);
      });
      if (sourcePromises.length) {
        console.log(`Waiting for ${sourcePromises} sources to resolve`);
        await Promise.all(sourcePromises);
        console.log(`Sources resolved`);
      }

      const newSources = thunkApi.getState().reactFlowReducer;
      const sourceNodes2 = getIncomers(
        node,
        newSources.nodes,
        newSources.edges
      );
      const sourceEdges2 = getConnectedEdges([node], newSources.edges);
      // populate the node's input with the output of the sources
      const input = sourceEdges2.reduce<Record<string, string>>((acc, edge) => {
        const sourceNode = sourceNodes2.find((node) => node.id === edge.source);
        if (sourceNode && edge.targetHandle) {
          acc[edge.targetHandle!] = sourceNode.data.output[edge.sourceHandle!];
          console.log(sourceNode.data.output);
        }
        return acc;
      }, {});

      // set the node's input
      await thunkApi.dispatch(
        editNodeAsync({
          id: node.id,
          newData: {
            input: {
              ...node.data?.input,
              ...input,
            },
          },
        })
      );

      // get the node again
      const node2: Node = thunkApi
        .getState()
        .reactFlowReducer.nodes.find((n: Node) => n.id === node.id);
      console.log('11111');
      console.log(node2);
      // run the node
      const output = node2 ? await runNode(node2, thunkApi) : node.data?.output;
      // update the node's output
      await thunkApi.dispatch(
        editNodeAsync({
          id: node.id,
          newData: { output: output },
        })
      );
      console.log(
        'returning output for node',
        node.id,
        output,
        'had input',
        input
      );
    };

    const { nodes, edges } = thunkApi.getState().reactFlowReducer;
    const endNodes: Node[] = nodes.filter(
      (node: Node) =>
        getIncomers(node, nodes, edges).length > 0 &&
        getOutgoers(node, nodes, edges).length == 0
    );
    for (const node of endNodes) {
      processNode(node, thunkApi);
    }
  }
);

interface ReactFlowState {
  nodes: Node[];
  edges: Edge[];
}

const initialState: ReactFlowState = {
  nodes: [],
  edges: [],
};

export const reactFlowSlice = createSlice({
  name: 'react-flow',
  initialState,
  reducers: {
    onNodesChange: (state, action: PayloadAction<NodeChange[]>) => {
      const changes = action.payload;
      state.nodes = applyNodeChanges(changes, state.nodes);
    },
    onEdgesChange: (state, action: PayloadAction<EdgeChange[]>) => {
      const changes = action.payload;
      state.edges = applyEdgeChanges(changes, state.edges);
    },
    onConnect: (state, action: PayloadAction<Edge | Connection>) => {
      let connection = action.payload;
      connection = {
        ...connection,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: '#787878',
        },
      };
      state.edges = addEdge(connection, state.edges);
    },
    addNode: (state, action: PayloadAction<Node>) => {
      const node = action.payload;
      state.nodes = [...state.nodes, node];
    },
    editNode: (state, action: PayloadAction<{ id: string; newData: any }>) => {
      const { id, newData } = action.payload;
      state.nodes = state.nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData,
            },
          };
        }
        return node;
      });
    },
    deleteNode: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.nodes = state.nodes.filter((node) => node.id !== id);
      state.edges = state.edges.filter(
        (edge) => edge.source !== id && edge.target !== id
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(editNodeAsync.fulfilled, (state, action) => {
      state.nodes = action.payload;
    });
  },
});

export default reactFlowSlice.reducer;

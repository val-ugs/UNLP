import { Instance } from 'reactflow';

export const editNode = (
  setNodes: Instance.SetNodes<any>,
  id: string,
  newData: any
) => {
  setNodes((nodes: any[]) =>
    nodes.map((node) => {
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
    })
  );
};

export const deleteNode = (
  setNodes: Instance.SetNodes<any>,
  setEdges: Instance.SetEdges<any>,
  id: string
) => {
  setNodes((nodes: any[]) => nodes.filter((node) => node.id !== id));
  setEdges((edges: any[]) =>
    edges.filter((edge) => edge.source !== id && edge.target !== id)
  );
};

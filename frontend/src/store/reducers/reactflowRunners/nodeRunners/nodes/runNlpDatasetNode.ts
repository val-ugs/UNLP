import { Node } from 'reactflow';

export const run = async (node: Node) => {
  return {
    nlpDataset: node.data?.input?.nlpDataset,
  };
};

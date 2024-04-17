import { Node } from 'reactflow';

export const run = async (node: Node) => {
  return {
    huggingFaceModel: node.data?.input?.huggingFaceModel,
  };
};

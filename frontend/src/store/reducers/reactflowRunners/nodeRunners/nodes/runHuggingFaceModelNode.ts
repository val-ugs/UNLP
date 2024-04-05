import { Node } from 'reactflow';

export const run = (node: Node) => {
  console.log('-----');
  console.log('huggingFaceModel');
  console.log(node);
  console.log('-----');

  return node.data.output;
};

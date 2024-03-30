import { Node } from 'reactflow';

export const run = (node: Node) => {
  console.log('-----');
  console.log('nlpDataset');
  console.log(node);
  console.log('-----');
  console.log(node);

  return node.data.output;
};

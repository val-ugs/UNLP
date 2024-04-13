import { Node } from 'reactflow';

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

export const run = async (node: Node) => {
  console.log('-----');
  console.log('nlpDataset');
  console.log(node);
  console.log('-----');

  await sleep(10000);

  return {
    nlpDataset: node.data?.input?.nlpDataset,
  };
};

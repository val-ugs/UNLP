import { Node } from 'reactflow';

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

export const run = async (node: Node) => {
  console.log('-----');
  console.log('huggingFaceModel');
  console.log(node);
  console.log('-----');

  await sleep(10000);

  return {
    huggingFaceModel: node.data?.input?.huggingFaceModel,
  };
};

import { Node } from 'reactflow';
import { huggingFaceModelApi } from 'services/huggingFaceModelService';
import { nlpDatasetApi } from 'services/nlpDatasetService';

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

export const run = async (node: Node, thunkApi: any) => {
  console.log('-----');
  console.log('predict');
  console.log(node);
  console.log('-----');
  // await thunkApi.dispatch(
  //   huggingFaceModelApi.endpoints.predictHuggingFaceModel.initiate({
  //     huggingFaceModel: node.data?.input?.huggingFaceModel,
  //     testNlpDatasetId: 12, //node.data?.input?.nlpDataset?.id
  //   })
  // );
  // const { data: nlpDataset } = await thunkApi.dispatch(
  //   nlpDatasetApi.endpoints.getNlpDatasetById.initiate(12)
  // );
  // return {
  //   nlpDataset: nlpDataset,
  // };
  await sleep(10000);
  return {
    nlpDataset: null,
  };
};

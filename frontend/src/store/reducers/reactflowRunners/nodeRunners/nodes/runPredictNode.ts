import { Node } from 'reactflow';
import { huggingFaceModelApi } from 'services/huggingFaceModelService';
import { nlpDatasetApi } from 'services/nlpDatasetService';

export const run = async (node: Node, thunkApi: any) => {
  await thunkApi.dispatch(
    huggingFaceModelApi.endpoints.predictHuggingFaceModel.initiate({
      huggingFaceModel: node.data?.input?.huggingFaceModel,
      testNlpDatasetId: node.data?.input?.nlpDataset?.id,
    })
  );
  const { data: nlpDataset } = await thunkApi.dispatch(
    nlpDatasetApi.endpoints.getNlpDatasetById.initiate(
      node.data?.input?.nlpDataset?.id
    )
  );
  return {
    nlpDataset: nlpDataset,
  };
};

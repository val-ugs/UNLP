import { Node } from 'reactflow';
import { actionApi } from 'services/actionService';

export const run = async (node: Node, thunkApi: any) => {
  const { data: nlpDataset } = await thunkApi.dispatch(
    actionApi.endpoints.clearNlpDataset.initiate({
      nlpDatasetId: node.data?.input?.nlpDataset?.id,
      field: node.data?.input?.field,
    })
  );

  return {
    nlpDataset: nlpDataset,
  };
};

import { Node } from 'reactflow';
import { actionApi } from 'services/actionService';

export const run = async (node: Node, thunkApi: any) => {
  const { data: nlpDataset } = await thunkApi.dispatch(
    actionApi.endpoints.clearNlpDataset.initiate({
      nlpDatasetId: node.data?.input?.nlpDataset?.id,
      clearField: node.data?.input?.clearField,
    })
  );

  return {
    nlpDataset: nlpDataset,
  };
};

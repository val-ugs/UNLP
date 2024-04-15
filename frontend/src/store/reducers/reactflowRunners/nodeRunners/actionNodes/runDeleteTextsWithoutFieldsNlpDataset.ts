import { Node } from 'reactflow';
import { actionApi } from 'services/actionService';

export const run = async (node: Node, thunkApi: any) => {
  const { data: nlpDataset } = await thunkApi.dispatch(
    actionApi.endpoints.deleteTextsWithoutFieldsNlpDataset.initiate(
      node.data?.input?.nlpDataset?.id
    )
  );

  return {
    nlpDataset: nlpDataset,
  };
};

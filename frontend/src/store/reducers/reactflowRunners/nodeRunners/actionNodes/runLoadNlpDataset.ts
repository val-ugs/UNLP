import { Node } from 'reactflow';
import { actionApi } from 'services/actionService';

export const run = async (node: Node, thunkApi: any) => {
  const { data: nlpDataset } = await thunkApi.dispatch(
    actionApi.endpoints.loadNlpDataset.initiate({
      filePath: node.data?.input?.filePath,
      textPatternToSplit: node.data?.input?.textPatternToSplit,
    })
  );

  return {
    nlpDataset: nlpDataset,
  };
};

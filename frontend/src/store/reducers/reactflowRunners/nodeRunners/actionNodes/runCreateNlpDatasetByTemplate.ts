import { Node } from 'reactflow';
import { actionApi } from 'services/actionService';

export const run = async (node: Node, thunkApi: any) => {
  const { data: nlpDataset } = await thunkApi.dispatch(
    actionApi.endpoints.createNlpDatasetByTemplate.initiate({
      nlpDatasets: [
        node.data?.input?.nlpDataset1,
        node.data?.input?.nlpDataset2,
      ],
      template: node.data?.input?.template,
      delimiter: node.data?.input?.delimiter,
    })
  );

  return {
    nlpDataset: nlpDataset,
  };
};

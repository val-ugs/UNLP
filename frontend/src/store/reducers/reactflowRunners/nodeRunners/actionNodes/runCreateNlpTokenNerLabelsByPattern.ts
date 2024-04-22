import { fieldType } from 'data/enums/fieldType';
import { Node } from 'reactflow';
import { actionApi } from 'services/actionService';

export const run = async (node: Node, thunkApi: any) => {
  if (
    !node.data?.input?.nerLabelPatterns ||
    node.data?.input?.nerLabelPatterns?.length == 0
  ) {
    throw new Error('Dataset not defined');
  }

  let nlpDataset = undefined;
  await thunkApi
    .dispatch(
      actionApi.endpoints.createNlpTokenNerLabelsByPattern.initiate({
        nlpDatasetId: node.data?.input?.nlpDataset?.id,
        nerLabelPatterns: node.data?.input?.nerLabelPatterns,
      })
    )
    .unwrap()
    .then((data) => {
      nlpDataset = data;
    })
    .catch((e) => {
      throw new Error(e.data.message);
    });

  return {
    nlpDataset: nlpDataset,
  };
};

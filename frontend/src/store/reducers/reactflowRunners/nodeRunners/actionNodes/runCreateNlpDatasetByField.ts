import { fieldType } from 'data/enums/fieldType';
import { Node } from 'reactflow';
import { actionApi } from 'services/actionService';

export const run = async (node: Node, thunkApi: any) => {
  if (
    node.data?.input?.createNlpDatasetByFieldDto?.nerLabelId == undefined &&
    node.data?.input?.createNlpDatasetByFieldDto?.field == fieldType.NerLabel
  ) {
    throw new Error('Dataset not defined');
  }
  const { data: nlpDataset } = await thunkApi.dispatch(
    actionApi.endpoints.createNlpDatasetByField.initiate({
      nlpDatasetId: node.data?.input?.nlpDataset?.id,
      createNlpDatasetByFieldDto: node.data?.input?.createNlpDatasetByFieldDto,
    })
  );

  console.log('nlpDataset: ', nlpDataset);

  return {
    nlpDataset: nlpDataset,
  };
};

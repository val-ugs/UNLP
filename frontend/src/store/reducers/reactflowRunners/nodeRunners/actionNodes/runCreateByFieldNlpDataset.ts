import { fieldType } from 'data/enums/fieldType';
import { Node } from 'reactflow';
import { actionApi } from 'services/actionService';

export const run = async (node: Node, thunkApi: any) => {
  console.log('test 1');
  if (
    node.data?.input?.createNlpDatasetByFieldDto?.nerLabelId == undefined &&
    node.data?.input?.createNlpDatasetByFieldDto?.field == fieldType.NerLabel
  ) {
    console.log('test 2');
    throw new Error('Dataset not defined');
  }
  console.log('test 3');
  const { data: nlpDataset } = await thunkApi.dispatch(
    actionApi.endpoints.createByFieldNlpDataset.initiate({
      nlpDatasetId: node.data?.input?.nlpDataset?.id,
      createNlpDatasetByFieldDto: node.data?.input?.createNlpDatasetByFieldDto,
    })
  );

  return {
    nlpDataset: nlpDataset,
  };
};

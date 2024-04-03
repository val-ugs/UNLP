import { Node } from 'reactflow';
import { run as runHuggingFaceModel } from './nodeRunners/runHuggingFaceModelNode';
import { run as runNlpDataset } from './nodeRunners/runNlpDatasetNode';
import { run as runPredict } from './nodeRunners/runPredictNode';

export const runNode = async (node: Node, thunkApi: any) => {
  switch (node.type) {
    case 'HuggingFaceModelNode':
      return await runHuggingFaceModel(node);
    case 'NlpDatasetNode':
      return await runNlpDataset(node);
    case 'PredictNode':
      return await runPredict(node, thunkApi);
  }
};

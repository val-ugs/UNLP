import { Node } from 'reactflow';
// import node runners
import { run as runHuggingFaceModel } from './nodeRunners/nodes/runHuggingFaceModelNode';
import { run as runNlpDataset } from './nodeRunners/nodes/runNlpDatasetNode';
import { run as runPredict } from './nodeRunners/nodes/runPredictNode';
// import action node runners
import { run as runCopyNlpDataset } from './nodeRunners/actionNodes/runCopyNlpDataset';

export const runNode = async (node: Node, thunkApi: any) => {
  switch (node.type) {
    // nodes
    case 'HuggingFaceModelNode':
      return await runHuggingFaceModel(node);
    case 'NlpDatasetNode':
      return await runNlpDataset(node);
    case 'PredictNode':
      return await runPredict(node, thunkApi);
    // action nodes
    case 'NlpDatasetCopyingNode':
      return await runCopyNlpDataset(node, thunkApi);
  }
};

import { Node } from 'reactflow';
import HuggingFaceModelNode, {
  run as runHuggingFaceModel,
} from './HuggingFaceModelNode';
import NlpDatasetNode, { run as runNlpDataset } from './NlpDatasetNode';
import PredictNode, { run as runPredict } from './PredictNode';

export const runNode = async (node: Node) => {
  switch (node.type) {
    case HuggingFaceModelNode.name:
      return await runHuggingFaceModel(node);
    case NlpDatasetNode.name:
      return await runNlpDataset(node);
    case PredictNode.name:
      return await runPredict(node);
  }
};
